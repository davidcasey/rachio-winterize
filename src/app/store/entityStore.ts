import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { fetchEntityId } from 'app/services/rachio-services';

interface EntityStoreState {
  id: string | undefined;
  token: string | null;
  setEntityToken: (token: string) => void;
  clearEntity: () => void;
};

// setEntityId is only used when setEntityToken is called 
interface EntityStorePrivate extends EntityStoreState {
  setEntityId: (id: string) => void;
}

const useEntityStore = create<EntityStorePrivate>()(
  devtools((set) => ({
    id: undefined,
    token: null,
    setEntityToken: async (token: string) => {
      set((state) => ({ ...state, token }));
      try {
        const { id } = await fetchEntityId();
        set((state) => ({ ...state, id }));
      } catch (e) {
        set((state) => ({ ...state, token: null, id: undefined }));
      }
    },
    clearEntity: () => set({ id: undefined, token: null }),
    // private
    setEntityId: (id: string) => set({ id }),
  }))
);

export const useEntityId = () => useEntityStore((state) => state.id);
export const useSetEntityToken = () => useEntityStore((state) => state.setEntityToken);
export const useClearEntity = () => useEntityStore((state) => state.clearEntity);

/**
 * Non hook versions for non React components
 */ 
// getEntityId is a good check to see if the token is valid and the entity is set
export const getEntityId = () => useEntityStore.getState().id;
export const getEntityToken = () => useEntityStore.getState().token;
