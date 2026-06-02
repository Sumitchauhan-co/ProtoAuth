import type { Request, Response } from 'express';
import {
    forgotPasswordService,
    getUserService,
    profileService,
    refreshService,
    resetPasswordService,
    signinService,
    signoutService,
    signupService,
    verifyEmailService,
} from './auth.service.js';
import apiResponse from '../../common/utils/apiResponse.js';
import apiError from '../../common/utils/apiError.js';
import type { CookieOptions } from 'express';

const signup = async (req: Request, res: Response) => {
    const { user, accessToken } = await signupService(req.body);

    const cookieOptions: CookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    };

    res.cookie('refreshToken', user.refreshToken, cookieOptions);

    return apiResponse.created(res, 'User created successfully', {
        user,
        accessToken,
    });
};

const signin = async (req: Request, res: Response) => {
    const { user, accessToken } = await signinService(req.body);

    const cookieOptions: CookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    };

    res.cookie('refreshToken', user.refreshToken, cookieOptions);

    return apiResponse.ok(res, 'User logged in successfully', {
        user,
        accessToken,
    });
};

const signout = async (req: Request, res: Response) => {
    const user = req.user!;

    if (!user) {
        throw apiError.notFound('User not found');
    }

    await signoutService(user);

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
    });

    return apiResponse.ok(res, 'User logged out successsfully');
};

const refresh = async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        throw apiError.unauthorized('Invalid or expired token');
    }

    const { accessToken, user } = await refreshService(refreshToken);

    if (!user) {
        throw apiError.notFound('User not found');
    }

    const cookieOptions: CookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    };

    res.cookie('refreshToken', user.refreshToken, cookieOptions);

    return apiResponse.ok(res, 'Token refreshed successfully', {
        accessToken,
        user,
    });
};

const profile = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id || Array.isArray(id)) {
        throw apiError.notFound('Profile not found');
    }

    const user = await profileService(id);

    return apiResponse.ok(res, 'User profile fetched successfully', user);
};

const forgotPassword = async (req: Request, res: Response) => {
    const email = req.body.email;

    if (!email) {
        throw apiError.notFound('Email not found');
    }

    await forgotPasswordService(email);

    return apiResponse.ok(
        res,
        'Email sent successfully to the existing account',
    );
};

const resetPassword = async (req: Request, res: Response) => {
    const { newPassword, confirmPassword } = req.body;
    const token = req.query.token as string;

    if (newPassword !== confirmPassword) {
        throw apiError.badRequest('Password incorrect');
    }

    if (!token || Array.isArray(token)) {
        throw apiError.unauthorized('Invalid token');
    }

    const user = await resetPasswordService({ token, newPassword });

    return apiResponse.ok(res, 'Password reset successfully', user);
};

const verifyEmail = async (req: Request, res: Response) => {
    try {
    const token = req.query.token as string;

    if (!token || Array.isArray(token)) {
        throw apiError.unauthorized('Invalid token');
    }

        await verifyEmailService(token);
        return res.redirect(`${process.env.FRONTEND_URL}?verified=true`);
    } catch (error) {
        return res.redirect(
            `${process.env.FRONTEND_URL}?verified=false`,
        );
    }
};

const getUser = async (req: Request, res: Response) => {
    const user = req.user;

    if (!user) {
        throw apiError.notFound('User not found');
    }

    const result = await getUserService(user.id);

    return apiResponse.ok(res, 'User fetched successfully', result);
};

export default {
    signup,
    signin,
    signout,
    refresh,
    profile,
    forgotPassword,
    resetPassword,
    verifyEmail,
    getUser,
};
