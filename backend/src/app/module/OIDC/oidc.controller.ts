import type { CookieOptions, Request, Response } from 'express';
import jose from 'node-jose';
import { PUBLIC_KEY } from './utils/cert.js';
import apiResponse from '../../common/utils/apiResponse.js';
import apiError from '../../common/utils/apiError.js';
import {
    signinService,
    signoutService,
    signupService,
    tokenService,
    userInfoService,
} from './oidc.service.js';

const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
};

const serviceDiscovery = (req: Request, res: Response) => {
    const ISSUER =
        process.env.BACKEND_URL || `http://localhost:${process.env.PORT}`;
    return res.json({
        issuer: ISSUER,
        authorization_endpoint: `${ISSUER}/o/authenticate`,
        userinfo_endpoint: `${ISSUER}/o/userinfo`,
        jwks_uri: `${ISSUER}/.well-known/jwks.json`,
        token_endpoint: `${ISSUER}/o/token`,
    });
};

const jwks = async (req: Request, res: Response) => {
    const key = await jose.JWK.asKey(PUBLIC_KEY, 'pem');
    return res.json({ keys: [key.toJSON()] });
};

const authenticate = async (req: Request, res: Response) => {
    const queryString = new URLSearchParams(req.query as any).toString();

    const redirectUrl = queryString
        ? `${process.env.FRONTEND_URL}/o/authenticate?${queryString}`
        : `${process.env.FRONTEND_URL}/o/authenticate`;

    return res.redirect(redirectUrl);
};

const signin = async (req: Request, res: Response) => {
    const { client_id, redirect_uri, state } = req.body;

    if (!client_id || !redirect_uri) {
        throw apiError.badRequest('Invalid or missing OIDC parameters');
    }

    const redirectUrl = await signinService(req.body, {
        client_id,
        redirect_uri,
        state,
    });

    if (!redirectUrl) {
        throw apiError.badRequest('Failed to generate redirect URL');
    }

    return apiResponse.ok(res, 'Successfully authenticated ', {
        redirectUrl: redirectUrl.toString(),
    });
};

const signup = async (req: Request, res: Response) => {
    const { client_id, redirect_uri, state } = req.body;

    if (!client_id || !redirect_uri) {
        throw apiError.badRequest('Invalid or missing OIDC parameters');
    }

    const redirectUrl = await signupService(req.body, {
        client_id,
        redirect_uri,
        state,
    });

    return apiResponse.created(
        res,
        'Successfully created and authorized account',
        {
            redirectUrl: redirectUrl.toString(),
        },
    );
};

const signout = async (req: Request, res: Response) => {
    const id_token = req.query.id_token;
    const redirect_uri = req.query.redirect_uri;

    if (!redirect_uri) {
        throw apiError.badRequest('Missing redirect_uri');
    }

    if (typeof redirect_uri !== 'string') {
        throw apiError.badRequest('Invalid redirect_uri format');
    }

    if (!id_token) {
        throw apiError.badRequest('Missing id_token');
    }

    if (typeof id_token !== 'string') {
        throw apiError.badRequest('Invalid id_token format');
    }

    await signoutService(id_token);

    res.clearCookie('refreshToken', cookieOptions);

    res.clearCookie('idToken', cookieOptions);

    return res.redirect(redirect_uri);
};

const token = async (req: Request, res: Response) => {
    const result = await tokenService(req.body);

    if (!result) {
        throw apiError.notFound('token details missing');
    }

    if (result?.refresh_token) {
        res.cookie('refreshToken', result.refresh_token, cookieOptions);
        res.cookie('idToken', result.id_token, cookieOptions);
    }

    return apiResponse.ok(res, 'Successfully created token', result);
};

const userInfo = async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw apiError.notFound('authentication header missing');
    }

    const user = await userInfoService(authHeader);

    if (!user) {
        throw apiError.notFound('token details missing');
    }

    return apiResponse.ok(res, 'Successfully created token', user);
};

export default {
    serviceDiscovery,
    jwks,
    authenticate,
    signin,
    signup,
    signout,
    token,
    userInfo,
};
