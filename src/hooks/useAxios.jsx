import { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuth from './useAuth';

const useAxios = () => {
    const { LogOut } = useAuth();
    const navigate = useNavigate();
    const [axiosError, setAxiosError] = useState(null);

    // Create Axios instance (memoized)
    const axiosSecure = useMemo(() => {
        return axios.create({
            baseURL: 'http://localhost:5000',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });
    }, []);

    // Handle unauthorized access
    const handleUnauthorized = useCallback(async () => {
        try {
            await LogOut();
            localStorage.removeItem('access-token');
            navigate('/login', {
                state: {
                    from: window.location.pathname,
                    sessionExpired: true,
                },
                replace: true,
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
    }, [LogOut, navigate]);

    useEffect(() => {
        // Request interceptor
        const requestInterceptor = axiosSecure.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('access-token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor
        const responseInterceptor = axiosSecure.interceptors.response.use(
            (response) => response,
            async (error) => {
                setAxiosError(error);

                const status = error.response?.status;
                const originalRequest = error.config;
                const isUnauthorized = status === 401 || status === 403;
                const isAlreadyRetried = originalRequest?._retry;

                if (isUnauthorized && !isAlreadyRetried) {
                    originalRequest._retry = true;

                    try {
                        // Optional: implement token refresh logic here
                        // const newToken = await refreshToken();
                        // localStorage.setItem('access-token', newToken);
                        // originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        // return axiosSecure(originalRequest);

                        await handleUnauthorized();
                        // eslint-disable-next-line no-unused-vars
                    } catch (refreshError) {
                        await handleUnauthorized();
                    }
                }

                // Format error consistently
                if (error.response) {
                    return Promise.reject({
                        message: error.response.data?.message || 'An error occurred',
                        status: error.response.status,
                        data: error.response.data,
                        headers: error.response.headers,
                        config: error.config,
                    });
                } else if (error.request) {
                    return Promise.reject({
                        message: 'Network error - no response received',
                        isNetworkError: true,
                    });
                } else {
                    return Promise.reject({
                        message: error.message || 'Request setup error',
                    });
                }
            }
        );

        // Cleanup interceptors on unmount
        return () => {
            axiosSecure.interceptors.request.eject(requestInterceptor);
            axiosSecure.interceptors.response.eject(responseInterceptor);
        };
    }, [axiosSecure, handleUnauthorized]);

    return [axiosSecure, axiosError];
};

export default useAxios;
