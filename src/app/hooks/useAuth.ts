import { useAuthId, getAuthId, getAuthToken, useClearAuth as clearAuth } from 'app/store/authStore';

// for UI React components
export const useIsAuth = () => !!useAuthId();

// for non React components, service calls, etc.
export const getIsAuth = () => !!getAuthId();

export const useClearAuth = () => clearAuth();

// Export getAuthToken for use in non-React contexts
export { getAuthToken };
