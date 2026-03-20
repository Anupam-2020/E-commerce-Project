import { AUTH_ACTIONS } from "@/constants/actionTypes";
import { User, AuthState } from "@/types/auth";

export const initialAuthState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

type AuthAction =
    | { type: typeof AUTH_ACTIONS.LOGIN_START }
    | { type: typeof AUTH_ACTIONS.LOAD_USER_START }
    | { type: typeof AUTH_ACTIONS.LOGIN_SUCCESS; payload: { user: User; token: string } }
    | { type: typeof AUTH_ACTIONS.LOAD_USER_SUCCESS; payload: { user: User } }
    | { type: typeof AUTH_ACTIONS.LOGIN_FAILURE; payload: string }
    | { type: typeof AUTH_ACTIONS.LOAD_USER_FAILURE; payload: string }
    | { type: typeof AUTH_ACTIONS.LOGOUT };


export function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case AUTH_ACTIONS.LOGIN_START:
        case AUTH_ACTIONS.LOAD_USER_START:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case AUTH_ACTIONS.LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            };
        case AUTH_ACTIONS.LOAD_USER_SUCCESS:
            return {
                ...state,
                user: action.payload.user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            };
        case AUTH_ACTIONS.LOGIN_FAILURE:
        case AUTH_ACTIONS.LOAD_USER_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case AUTH_ACTIONS.LOGOUT:
            return initialAuthState;
        default:
            return state;
    }
}