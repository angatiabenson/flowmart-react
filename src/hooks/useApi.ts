import { useAuth } from '@/context/AuthContext';
import { apiWrapper, parseApiResponse } from '@/utils/api';
import axios, { type AxiosInstance } from 'axios';
import type { LoginResponseData } from '@/types/api';
import { useMemo } from 'react';

export function useApi() {
    const { token } = useAuth();

    const apiClient = useMemo(() => {
        return axios.create({
            baseURL: '/api/',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            withCredentials: true,
            withXSRFToken: true,
        });
    }, [token]);

    return useMemo(() => ({
        login: async (email: string, password: string) => {
            return await apiWrapper<LoginResponseData>({
                apiCall: apiClient.post('login', { email, password }),
                parser: parseApiResponse
            });
        },
    }), [apiClient]);
}