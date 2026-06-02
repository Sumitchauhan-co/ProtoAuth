import type { Request, Response } from 'express';
import apiResponse from '../../common/utils/apiResponse.js';
import apiError from '../../common/utils/apiError.js';
import {
    applicationDataService,
    applicationService,
    getApplicationService,
    getStatService,
} from './admin.service.js';

const application = async (req: Request, res: Response) => {
    if (!req.user?.id) {
        throw apiError.unauthorized('Unauthorized');
    }

    const user = req.user;

    const result = await applicationService(req.body, user);

    return apiResponse.ok(res, 'Successfully submitted application', result);
};

const applicationData = async (req: Request, res: Response) => {
    const { client_id } = req.params;

    if (!client_id || Array.isArray(client_id)) {
        throw apiError.notFound('client id not found');
    }

    const data = await applicationDataService(client_id);

    return apiResponse.ok(res, 'Application data fetched successfully', data);
};

const getApplication = async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
        throw apiError.unauthorized('User not authenticated');
    }

    const data = await getApplicationService(userId);

    return apiResponse.ok(res, 'Application data fetched successfully', data);
};

const getStat = async (req: Request, res: Response) => {
    const dashboardOwnerId = req.user?.id;

    if (!dashboardOwnerId) {
        throw apiError.unauthorized('User not authenticated');
    }

    const data = await getStatService(dashboardOwnerId);

    return apiResponse.ok(res, 'Admin stats data fetched successfully', data);
};

export default { application, applicationData, getApplication, getStat };
