import { useAuth } from '@/context/AuthContext';
import { apiWrapper, parseApiResponse } from '@/utils/api';
import axios, { type AxiosInstance } from 'axios';
import type { CategoriesListData, LoginResponseData, ProductsListData } from '@/types/api';
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
        signup: async (data: { name: string; email: string; phone?: string; password: string; }) => {
            return await apiWrapper<LoginResponseData>({
                apiCall: apiClient.post('register', data),
                parser: parseApiResponse
            });
        },

        //Products
        fetchProducts: async () => {
            return await apiWrapper<ProductsListData>({
                apiCall: apiClient.get('products'),
                parser: parseApiResponse
            });
        },

        //Categories
        fetchCategories: async () => {
            return await apiWrapper<CategoriesListData>({
                apiCall: apiClient.get('categories'),
                parser: parseApiResponse
            });
        }
    }), [apiClient]);
}