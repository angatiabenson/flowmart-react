import { useAuth } from '@/context/AuthContext';
import type { LoginResponseData } from '@/types/api';
import { apiWrapper, ensureSuccess, parseApiResponse } from '@/utils/api';
import axios from 'axios';
import type { AxiosInstance } from 'axios';

const state = useAuth();
const token = state?.token;

const apiClient: AxiosInstance = axios.create({
    baseURL: 'https://flowmart.banit.co.ke/',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: token ? `Bearer ${token}` : '',
    },
    withCredentials: true,
    withXSRFToken: true,
});

export const api = {
    login: async (email: string, password: string) => {
        return await apiWrapper<LoginResponseData>({
            apiCall: apiClient.post('login', { email, password }),
            parser: parseApiResponse
        });
    },
};