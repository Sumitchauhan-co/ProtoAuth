import { and, count, countDistinct, eq, inArray } from 'drizzle-orm';
import { db } from '../../common/db/index.js';
import {
    applicationsTable,
    authLogsTable,
    userApplicationsTable,
} from '../../common/db/schema.js';
import apiError from '../../common/utils/apiError.js';
import { generateToken } from '../auth/utils/token.js';

export const applicationService = async (
    {
        name,
        redirectUris,
    }: {
        name: string;
        redirectUris: string[];
    },
    user: { id: string; role: string },
) => {
    if (
        !name ||
        !Array.isArray(redirectUris) ||
        redirectUris.length === 0 ||
        redirectUris.some((uri) => typeof uri !== 'string')
    ) {
        throw apiError.badRequest('Valid redirect URIs required');
    }

    const normalizedRedirectUris = redirectUris.map((uri) => uri.trim());

    const { token: client_id } = await generateToken();

    const { token, hashedToken } = await generateToken();

    await db.insert(applicationsTable).values({
        name,
        clientId: client_id,
        clientSecret: hashedToken,
        redirectUris: normalizedRedirectUris,
        isActive: true,
        ownerId: user?.id,
    });

    return {
        client_id,
        client_secret: token,
    };
};

export const applicationDataService = async (client_id: string) => {
    const [data] = await db
        .select({ name: applicationsTable.name })
        .from(applicationsTable)
        .where(eq(applicationsTable.clientId, client_id));

    if (!data) {
        throw apiError.notFound('Application not found');
    }

    return data;
};

export const getApplicationService = async (userId: string) => {
    const data = await db
        .select()
        .from(applicationsTable)
        .where(eq(applicationsTable.ownerId, userId))
        .limit(1);

    if (!data) {
        throw apiError.notFound('Application not found');
    }

    return data;
};

export const getStatService = async (dashboardOwnerId: string) => {
    const ownerApps = await db
        .select({ clientId: applicationsTable.clientId })
        .from(applicationsTable)
        .where(eq(applicationsTable.ownerId, dashboardOwnerId));

    const clientIds = ownerApps.map((app) => app.clientId);

    if (clientIds.length === 0) {
        return { totalEndUsers: 0, activeApps: 0, totalAuthRequests: 0 };
    }

    const [activeAppsRes, authLogsRes, userMappingRes] = await Promise.all([
        db
            .select({ value: count() })
            .from(applicationsTable)
            .where(
                and(
                    eq(applicationsTable.ownerId, dashboardOwnerId),
                    eq(applicationsTable.isActive, true),
                ),
            ),

        db
            .select({ value: count() })
            .from(authLogsTable)
            .where(inArray(authLogsTable.clientId, clientIds)),

        db
            .select({ value: countDistinct(userApplicationsTable.userId) })
            .from(userApplicationsTable)
            .where(inArray(userApplicationsTable.clientId, clientIds)),
    ]);

    return {
        activeApps: activeAppsRes[0]?.value || 0,
        totalAuthRequests: authLogsRes[0]?.value || 0,
        totalEndUsers: userMappingRes[0]?.value || 0,
    };
};
