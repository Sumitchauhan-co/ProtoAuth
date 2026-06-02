import { eq } from 'drizzle-orm';
import { db } from '../../common/db/index.js';
import {
    applicationsTable,
    authCodesTable,
    authLogsTable,
    refreshTokensTable,
    userApplicationsTable,
    usersTable,
} from '../../common/db/schema.js';
import apiError from '../../common/utils/apiError.js';
import {
    compareUserPassword,
    generateHashPassword,
    generateToken,
} from '../auth/utils/token.js';
import jwt from 'jsonwebtoken';
import { PRIVATE_KEY, PUBLIC_KEY } from './utils/cert.js';

interface SigninType {
    email: string;
    password: string;
}

interface SignupType {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

interface SigninTypeQuery {
    client_id: string;
    redirect_uri: string;
    state: string | undefined;
}

interface TokenType {
    code: string;
    client_id: string;
    client_secret: string;
    redirect_uri: string;
    grant_type: string;
    refresh_token?: string;
}

export const signinService = async (
    { email, password }: SigninType,
    { client_id, redirect_uri, state }: SigninTypeQuery,
) => {
    if (!email || !password || !client_id || !redirect_uri) {
        throw apiError.badRequest('Missing fields');
    }

    // validate client
    const [client] = await db
        .select()
        .from(applicationsTable)
        .where(eq(applicationsTable.clientId, client_id))
        .limit(1);

    if (!client || !client.isActive) {
        throw apiError.unauthorized('Invalid client');
    }

    if (!client.redirectUris.includes(redirect_uri)) {
        throw apiError.badRequest('Invalid redirect_uri');
    }

    // validate user
    const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1);

    if (!user) {
        const signupUrl = new URL(
            `${process.env.FRONTEND_URL}/o/authenticate/signup`,
        );
        signupUrl.searchParams.set('email', email);
        signupUrl.searchParams.set('client_id', client_id);
        signupUrl.searchParams.set('redirect_uri', redirect_uri);
        if (state) signupUrl.searchParams.set('state', state);

        return signupUrl;
    }

    const isMatch = await compareUserPassword(password, user.password);

    if (!isMatch) {
        throw apiError.unauthorized('Invalid credentials');
    }

    // generate AUTH CODE
    const { token } = await generateToken();

    await db.insert(authCodesTable).values({
        code: token,
        userId: user.id,
        clientId: client_id,
        redirectUri: redirect_uri,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    const redirect = new URL(redirect_uri);
    redirect.searchParams.set('code', token);
    if (state) redirect.searchParams.set('state', state);

    return redirect;
};

export const signupService = async (
    { email, password, firstName, lastName }: SignupType,
    { client_id, redirect_uri, state }: SigninTypeQuery,
) => {
    if (!email || !password || !firstName || !client_id || !redirect_uri) {
        throw apiError.badRequest('Missing required identity fields');
    }

    const [client] = await db
        .select()
        .from(applicationsTable)
        .where(eq(applicationsTable.clientId, client_id))
        .limit(1);

    if (!client || !client.isActive) {
        throw apiError.unauthorized('Invalid or inactive client');
    }

    if (!client.redirectUris.includes(redirect_uri)) {
        throw apiError.badRequest('Invalid redirect_uri');
    }

    const [existingUser] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1);

    if (existingUser) {
        throw apiError.conflict('An account with this email already exists');
    }

    const hashedPassword = await generateHashPassword(password);
    const [newUser] = await db
        .insert(usersTable)
        .values({
            email,
            password: hashedPassword,
            firstName,
            lastName,
        })
        .returning();

    if (!newUser) {
        throw apiError.internal('Internal server error');
    }

    const { token } = await generateToken();

    await db.insert(authCodesTable).values({
        code: token,
        userId: newUser.id,
        clientId: client_id,
        redirectUri: redirect_uri,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min expiry
    });

    const redirect = new URL(redirect_uri);
    redirect.searchParams.set('code', token);
    if (state) redirect.searchParams.set('state', state);

    return redirect;
};

export const tokenService = async ({
    code,
    client_id,
    client_secret,
    redirect_uri,
    grant_type,
    refresh_token,
}: TokenType) => {
    if (!grant_type) {
        throw apiError.badRequest('Missing grant_type');
    }

    if (grant_type === 'authorization_code') {
        if (!code || !client_id || !client_secret || !redirect_uri) {
            throw apiError.badRequest('Missing parameters');
        }

        // validate client
        const [client] = await db
            .select()
            .from(applicationsTable)
            .where(eq(applicationsTable.clientId, client_id))
            .limit(1);

        if (!client || !client.isActive) {
            throw apiError.unauthorized('Invalid client');
        }

        // auth request

        await db.insert(authLogsTable).values({
            clientId: client_id,
            action:
                grant_type === 'authorization_code'
                    ? 'CODE_EXCHANGE'
                    : 'REFRESH',
            status: 'SUCCESS',
            metadata: {},
        });

        const validsecret = client_secret === client.clientSecret;

        if (!validsecret) {
            throw apiError.unauthorized('Invalid client_secret');
        }

        // get auth code
        const [stored] = await db
            .select()
            .from(authCodesTable)
            .where(eq(authCodesTable.code, code))
            .limit(1);

        if (!stored) throw apiError.badRequest('Invalid code');

        if (
            stored.clientId !== client_id ||
            stored.redirectUri !== redirect_uri
        ) {
            throw apiError.badRequest('Invalid code usage');
        }

        if (new Date() > stored.expiresAt) {
            throw apiError.badRequest('Code expired');
        }

        // get user
        const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, stored.userId))
            .limit(1);

        if (!user) throw apiError.notFound('User not found');

        // users

        await db
            .insert(userApplicationsTable)
            .values({ userId: user.id, clientId: client_id })
            .onConflictDoNothing();

        const ISSUER = `http://localhost:${process.env.PORT}`;
        const now = Math.floor(Date.now() / 1000);

        const payload = {
            iss: ISSUER,
            sub: user.id,
            email: user.email,
            exp: now + 3600,
            firstName: user.firstName,
            lastName: user.lastName,
        };

        const access_token = jwt.sign(payload, PRIVATE_KEY, {
            algorithm: 'RS256',
        });

        const id_token = jwt.sign(
            {
                ...payload,
            },
            PRIVATE_KEY,
            { algorithm: 'RS256' },
        );

        // delete code (single use)
        await db.delete(authCodesTable).where(eq(authCodesTable.code, code));

        const { token, hashedToken } = await generateToken();

        // store in DB
        await db
            .update(usersTable)
            .set({ refreshToken: hashedToken })
            .where(eq(usersTable.id, user.id));

        return {
            id_token,
            access_token,
            refresh_token: token,
            token_type: 'Bearer',
            expires_in: 3600,
        };
    } else if (grant_type === 'refresh_token') {
        if (!refresh_token || !client_id) {
            throw apiError.badRequest('Missing params');
        }

        const hashToken = await generateHashPassword(refresh_token);

        const [stored] = await db
            .select()
            .from(refreshTokensTable)
            .where(eq(refreshTokensTable.token, hashToken))
            .limit(1);

        if (!stored) {
            throw apiError.unauthorized('Invalid refresh token');
        }

        if (new Date() > stored.expiresAt) {
            throw apiError.unauthorized('Expired refresh token');
        }

        const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, stored.userId))
            .limit(1);

        if (!user) throw apiError.notFound('User not found');

        const ISSUER = `http://localhost:${process.env.PORT}`;
        const now = Math.floor(Date.now() / 1000);

        const access_token = jwt.sign(
            {
                iss: ISSUER,
                sub: user.id,
                email: user.email,
                exp: now + 3600,
            },
            PRIVATE_KEY,
            { algorithm: 'RS256' },
        );

        return {
            access_token,
            token_type: 'Bearer',
            expires_in: 3600,
        };
    }

    throw apiError.badRequest('Unsupported grant_type');
};

export const userInfoService = async (authHeader: string) => {
    if (!authHeader?.startsWith('Bearer ')) {
        throw apiError.unauthorized('Missing Authorization header');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        throw apiError.unauthorized('Missing Authorization header');
    }

    let payload: any;
    try {
        payload = jwt.verify(token, PUBLIC_KEY, {
            algorithms: ['RS256'],
        });
    } catch {
        throw apiError.unauthorized('Invalid token');
    }

    const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, payload.sub))
        .limit(1);

    if (!user) throw apiError.notFound('User not found');

    return {
        sub: user.id,
        email: user.email,
        name: [user.firstName, user.lastName].join(' '),
    };
};
