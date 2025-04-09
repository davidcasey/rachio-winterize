import { useEntityId, getEntityId, useClearEntity } from 'app/store/entityStore';

// for UI React components
export const useIsAuth = () => !!useEntityId();

// for non React components, service calls, etc.
export const getIsAuth = () => !!getEntityId();

export const useClearAuth = () => useClearEntity();
