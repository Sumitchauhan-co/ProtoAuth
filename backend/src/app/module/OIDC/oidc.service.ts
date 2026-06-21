import { eq } from 'drizzle-orm';
import { db } from '../../common/db/index.js';
import {
    applicationsTable,
    authCodesTable,
    userApplicationsTable,
    usersTable,
} from '../../common/db/schema.js';
import apiError from '../../common/utils/apiError.js';
import {
    compareUserPassword,
    generateHashedToken,
    generateHashPassword,
    generateToken,
} from '../auth/utils/token.js';
import jwt from 'jsonwebtoken';
import { PRIVATE_KEY, PUBLIC_KEY } from './utils/cert.js';
import crypto from 'crypto';

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
    response_type: string;
    client_id: string;
    redirect_uri: string;

    state?: string;
    scope?: string;

    nonce?: string;

    code_challenge?: string;
    code_challenge_method?: string;
}

interface IdTokenPayload {
    iss: string;
    sub: string;
    aud: string;
    exp: number;
    iat: number;
    nonce?: string;
    email?: string;
    name?: string;
    given_name?: string;
    family_name?: string | null;
}

interface TokenType {
    grant_type: string;
    client_id: string;
    client_secret?: string;
    code?: string;
    redirect_uri?: string;
    refresh_token?: string;
    code_verifier?: string;
}

interface RevocationType {
    token: string;
    token_type_hint?: 'access_token' | 'refresh_token';
    client_id: string;
    client_secret?: string;
}

export const signinService = async (
    { email, password }: SigninType,
    query: SigninTypeQuery,
) => {
    const {
        client_id,
        redirect_uri,
        state,
        response_type,
        scope,
        nonce,
        code_challenge,
        code_challenge_method,
    } = query;

    if (!email || !password || !response_type || !client_id || !redirect_uri) {
        throw apiError.badRequest('Missing fields');
    }

    if (response_type !== 'code') {
        throw apiError.badRequest(
            `Unsupported response_type: "${response_type}". This server only supports "code".`,
        );
    }

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
        signupUrl.searchParams.set('response_type', response_type);
        signupUrl.searchParams.set('client_id', client_id);
        signupUrl.searchParams.set('redirect_uri', redirect_uri);

        if (state) signupUrl.searchParams.set('state', state);
        if (scope) signupUrl.searchParams.set('scope', scope);
        if (nonce) signupUrl.searchParams.set('nonce', nonce);
        if (code_challenge)
            signupUrl.searchParams.set('code_challenge', code_challenge);
        if (code_challenge_method)
            signupUrl.searchParams.set(
                'code_challenge_method',
                code_challenge_method,
            );

        return signupUrl;
    }

    const isMatch = await compareUserPassword(password, user.password);

    if (!isMatch) {
        throw apiError.unauthorized('Invalid credentials');
    }

    const { token } = await generateToken();

    await db.insert(authCodesTable).values({
        code: token,
        userId: user.id,
        clientId: client_id,
        redirectUri: redirect_uri,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minute validity window
        scope: scope || 'openid',
        nonce: nonce || null,
        codeChallenge: code_challenge || null,
        codeChallengeMethod: code_challenge_method || 'plain',
    });

    const redirect = new URL(redirect_uri);
    redirect.searchParams.set('code', token);
    if (state) redirect.searchParams.set('state', state);

    return redirect;
};

export const signupService = async (
    { email, password, firstName, lastName }: SignupType,
    query: SigninTypeQuery,
) => {
    const {
        client_id,
        redirect_uri,
        state,
        response_type,
        scope,
        nonce,
        code_challenge,
        code_challenge_method,
    } = query;

    if (
        !email ||
        !password ||
        !firstName ||
        !response_type ||
        !client_id ||
        !redirect_uri
    ) {
        throw apiError.badRequest('Missing required identity fields');
    }

    if (response_type !== 'code') {
        throw apiError.badRequest(
            `Unsupported response_type: "${response_type}". This server only supports "code".`,
        );
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
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minute validity window
        scope: scope || 'openid',
        nonce: nonce || null,
        codeChallenge: code_challenge || null,
        codeChallengeMethod: code_challenge_method || 'plain',
    });

    const redirect = new URL(redirect_uri);
    redirect.searchParams.set('code', token);
    if (state) redirect.searchParams.set('state', state);

    return redirect;
};

export const signoutService = async (id_token: string) => {
    const decoded = jwt.verify(id_token, PUBLIC_KEY, {
        algorithms: ['RS256'],
    }) as { sub: string };

    const userId = decoded.sub;

    if (!userId) {
        throw apiError.notFound('User not found');
    }

    await db
        .update(usersTable)
        .set({ refreshToken: null })
        .where(eq(usersTable.id, userId));
};

export const tokenService = async (params: TokenType) => {
    const {
        grant_type,
        client_id,
        client_secret,
        code,
        redirect_uri,
        refresh_token,
        code_verifier,
    } = params;

    if (!grant_type) throw apiError.badRequest('Missing grant_type');

    const ISSUER =
        process.env.BACKEND_URL || `http://localhost:${process.env.PORT}`;
    const now = Math.floor(Date.now() / 1000);

    if (grant_type === 'authorization_code') {
        if (!code || !client_id || !redirect_uri) {
            throw apiError.badRequest('Missing required parameters');
        }

        const [client] = await db
            .select()
            .from(applicationsTable)
            .where(eq(applicationsTable.clientId, client_id))
            .limit(1);

        if (!client || !client.isActive)
            throw apiError.unauthorized('Invalid or inactive client');

        const [stored] = await db
            .select()
            .from(authCodesTable)
            .where(eq(authCodesTable.code, code))
            .limit(1);

        if (!stored)
            throw apiError.badRequest('Invalid or spent authorization code');
        if (
            stored.clientId !== client_id ||
            stored.redirectUri !== redirect_uri
        ) {
            throw apiError.badRequest('Authorization parameter mismatch');
        }
        if (new Date() > stored.expiresAt)
            throw apiError.badRequest('Authorization code expired');

        if (stored.codeChallenge) {
            if (!code_verifier) {
                throw apiError.badRequest(
                    'Missing code_verifier parameter required for PKCE flow',
                );
            }

            let calculatedChallenge = code_verifier;

            if (stored.codeChallengeMethod === 'S256') {
                calculatedChallenge = crypto
                    .createHash('sha256')
                    .update(code_verifier)
                    .digest('base64url');
            }

            if (calculatedChallenge !== stored.codeChallenge) {
                throw apiError.unauthorized(
                    'PKCE verification failed: Invalid code_verifier',
                );
            }
        } else {
            // Fallback: Client initialized without PKCE. Enforce traditional secret verification.
            if (!client_secret || client_secret !== client.clientSecret) {
                throw apiError.unauthorized(
                    'Invalid client_secret credentials',
                );
            }
        }

        const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, stored.userId))
            .limit(1);

        if (!user) throw apiError.notFound('User context not found');

        // Burn authorization code immediately after 1 use to prevent replay attacks
        await db.delete(authCodesTable).where(eq(authCodesTable.code, code));

        await db
            .insert(userApplicationsTable)
            .values({ userId: user.id, clientId: client_id })
            .onConflictDoNothing();

        const basePayload = {
            iss: ISSUER,
            sub: user.id,
            client_id,
            exp: now + 3600, // 1 hour access
            scope: stored.scope,
        };

        const access_token = jwt.sign(basePayload, PRIVATE_KEY, {
            algorithm: 'RS256',
        });

        const idTokenPayload: IdTokenPayload = {
            iss: ISSUER,
            sub: user.id,
            aud: client_id,
            exp: now + 3600,
            iat: now,
        };

        if (stored.scope.includes('openid')) {
            if (stored.nonce) idTokenPayload.nonce = stored.nonce;
            if (stored.scope.includes('email'))
                idTokenPayload.email = user.email;
            if (stored.scope.includes('profile')) {
                idTokenPayload.name =
                    `${user.firstName} ${user.lastName || ''}`.trim();
                idTokenPayload.given_name = user.firstName;
                idTokenPayload.family_name = user.lastName;
            }
        }

        const id_token = jwt.sign(idTokenPayload, PRIVATE_KEY, {
            algorithm: 'RS256',
        });

        const { token: clearRefreshToken, hashedToken: secureRefreshHash } =
            await generateToken();

        await db
            .update(usersTable)
            .set({ refreshToken: secureRefreshHash })
            .where(eq(usersTable.id, user.id));

        return {
            id_token,
            access_token,
            refresh_token: clearRefreshToken,
            token_type: 'Bearer',
            expires_in: 3600,
        };
    }

    if (grant_type === 'refresh_token') {
        if (!refresh_token || !client_id)
            throw apiError.badRequest('Missing parameters');

        const targetLookupHash = await generateHashedToken(refresh_token);

        const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.refreshToken, targetLookupHash))
            .limit(1);

        if (!user)
            throw apiError.unauthorized('Invalid or expired refresh token');

        const access_token = jwt.sign(
            {
                iss: ISSUER,
                sub: user.id,
                client_id,
                exp: now + 3600,
            },
            PRIVATE_KEY,
            { algorithm: 'RS256' },
        );

        const idTokenPayload: IdTokenPayload = {
            iss: ISSUER,
            sub: user.id,
            aud: client_id,
            exp: now + 3600,
            iat: now,
            name: `${user.firstName} ${user.lastName || ''}`.trim(),
            email: user.email,
            given_name: user.firstName,
            family_name: user.lastName,
        };

        const id_token = jwt.sign(idTokenPayload, PRIVATE_KEY, {
            algorithm: 'RS256',
        });

        const {
            token: newClearRefreshToken,
            hashedToken: newSecureRefreshHash,
        } = await generateToken();

        await db
            .update(usersTable)
            .set({ refreshToken: newSecureRefreshHash })
            .where(eq(usersTable.id, user.id));

        return {
            id_token,
            access_token,
            refresh_token: newClearRefreshToken,
            token_type: 'Bearer',
            expires_in: 3600,
        };
    }

    throw apiError.badRequest('Unsupported grant_type');
};

export const revocationService = async ({
    token,
    client_id,
    client_secret,
}: RevocationType) => {
    if (!token || !client_id) {
        throw apiError.badRequest('Missing required revocation parameters');
    }

    const [client] = await db
        .select()
        .from(applicationsTable)
        .where(eq(applicationsTable.clientId, client_id))
        .limit(1);

    if (!client || !client.isActive) {
        throw apiError.unauthorized('Invalid client');
    }

    if (client.clientSecret && client_secret !== client.clientSecret) {
        throw apiError.unauthorized('Invalid client credentials');
    }

    const secureTokenLookupHash = await generateHashedToken(token);

    await db
        .update(usersTable)
        .set({ refreshToken: null })
        .where(eq(usersTable.refreshToken, secureTokenLookupHash));

    return true;
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
