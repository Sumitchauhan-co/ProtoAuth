import axios from 'axios';
import { getAccessToken, setAccessToken } from '@/store/store';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = getAccessToken();

    const skipUrls = ['/api/signin', '/api/signup'];

    if (skipUrls.some((url) => config.url?.includes(url))) {
        return config;
    }

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        if (!originalRequest || originalRequest._retry) {
            return Promise.reject(error);
        }

        const isAuthPost =
            originalRequest.url?.includes('/api/signin') ||
            originalRequest.url?.includes('/api/signup') ||
            originalRequest.url?.includes('/api/refresh');

        if (
            error.response?.status === 401 && !isAuthPost
        ) {
            originalRequest._retry = true;

            try {
                const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/refresh`, {}, {
                    withCredentials: true
                });

                const newAccessToken = res.data?.data?.accessToken || res.data?.accessToken;

                if (!newAccessToken) throw new Error("No token returned");

                setAccessToken(newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                
                return api(originalRequest);
            } catch (refreshError) {
                setAccessToken(null);
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);

export default api;