import { useEntityId, useClearEntity } from 'app/store/entityStore';

export const useIsAuth = () => !!useEntityId();

export const useClearAuth = () => useClearEntity();
