import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { fetchEntityId } from 'app/services/rachio-services';

interface AuthStoreState {
  id: string | undefined;
  token: string | null;
  setAuthToken: (token: string) => void;
  clearAuth: () => void;
};

// setAuthId is only used when setAuthToken is called 
interface AuthStorePrivate extends AuthStoreState {
  setAuthId: (id: string) => void;
}

const useAuthStore = create<AuthStorePrivate>()(
  devtools((set) => ({
    id: undefined,
    token: null,
    setAuthToken: async (token: string) => {
      set((state) => ({ ...state, token }));
      try {
        const { id } = await fetchEntityId();
        set((state) => ({ ...state, id }));
      } catch (e) {
        set((state) => ({ ...state, token: null, id: undefined }));
      }
    },
    clearAuth: () => set({ id: undefined, token: null }),
    // private
    setAuthId: (id: string) => set({ id }),
  }))
);

export const useAuthId = () => useAuthStore((state) => state.id);
export const useSetAuthToken = () => useAuthStore((state) => state.setAuthToken);
export const useClearAuth = () => useAuthStore((state) => state.clearAuth);

/**
 * Non hook versions for non React components
 */ 
export const getAuthId = () => useAuthStore.getState().id;
export const getAuthToken = () => useAuthStore.getState().token;
