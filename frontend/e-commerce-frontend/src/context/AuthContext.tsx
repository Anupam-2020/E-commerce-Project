'use client';

import { ReactNode, useMemo, useReducer, useEffect, createContext } from 'react';
import api from '@/lib/api';
import endpoints from '@/lib/endpoints';
import { clearToken, getToken, setToken } from '@/lib/storage';
import { AUTH_ACTIONS } from '@/constants/actionTypes';
import { authReducer, initialAuthState } from '@/reducers/authReducer';
import { LoginPayload, RegisterPayload } from '@/types/auth';

interface AuthContextValue {
    user: typeof initialAuthState.user;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (payload: LoginPayload) => Promise<{ success: boolean }>;
    register: (payload: RegisterPayload) => Promise<{ success: boolean }>;
    logout: () => void;
    loadUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(authReducer, {
        ...initialAuthState,
        token: getToken(),
  });

    async function login(payload: LoginPayload) {
        dispatch({ type: AUTH_ACTIONS.LOGIN_START });
        try {
        const { data } = await api.post(endpoints.auth.login, payload);
        setToken(data.token);
        dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: { user: data.user, token: data.token },
        });
        return { success: true };
        } catch (error: any) {
        dispatch({
            type: AUTH_ACTIONS.LOGIN_FAILURE,
            payload: error?.response?.data?.message || 'Login failed',
        });
        return { success: false };
        }
    }

    async function register(payload: RegisterPayload) {
        dispatch({ type: AUTH_ACTIONS.LOGIN_START });
        try {
        const { data } = await api.post(endpoints.auth.register, payload);
        setToken(data.token);
        dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: { user: data.user, token: data.token },
        });
        return { success: true };
        } catch (error: any) {
        dispatch({
            type: AUTH_ACTIONS.LOGIN_FAILURE,
            payload: error?.response?.data?.message || 'Registration failed',
        });
        return { success: false };
        }
    }

    async function loadUser() {
        const token = getToken();
        if (!token) return;
        dispatch({ type: AUTH_ACTIONS.LOAD_USER_START });
        try {
        const { data } = await api.get(endpoints.auth.me);
        dispatch({ type: AUTH_ACTIONS.LOAD_USER_SUCCESS, payload: { user: data } });
        } catch (error: any) {
        clearToken();
        dispatch({
            type: AUTH_ACTIONS.LOAD_USER_FAILURE,
            payload: error?.response?.data?.message || 'Failed to load user',
        });
        }
    }

    function logout() {
        clearToken();
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }

    useEffect(() => {
        loadUser();
    }, []);

    const value = useMemo(
        () => ({ ...state, login, register, logout, loadUser }),
        [state]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}