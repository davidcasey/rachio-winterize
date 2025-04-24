import { useEffect } from 'react';
import { create } from 'zustand';

import { Device, Zone } from 'app/models/rachioModels';
import { useEntity } from 'app/services/rachio-services';
import { getIsAuth } from 'app/hooks/useAuth';
import { WinterizeStep } from 'app/models/winterizeModels';

const initialWinterizeState = {
  loading: false,
  error: null,
  hydrated: false,
  devices: null,
  zones: null,
  selectedDevice: null,
  activeStep: null, 
  winterizeSequence: [],
};

interface WinterizeStoreActions {
  setSelectedDevice: (selectedDevice: Device) => void;
  addWinterizeSteps: (steps: WinterizeStep[]) => void;
  removeWinterizeSteps: (steps: WinterizeStep[]) => void;
  updateWinterizeStep: (id: string, updatedStep: Partial<WinterizeStep>) => void;
  setActiveStep: (activeStep: WinterizeStep | null) => void, 
  resetWinterizeSequence: () => void;
}

interface WinterizeStoreState {
  // Store
  loading: boolean;
  error: string | null;
  hydrated: boolean; // set hydrated to false to rehydrate store
  init: (devices: Device[]) => void;
  // Rachio
  devices: Device[] | null;
  zones: Zone[] | null;
  // Winterize
  selectedDevice: Device | null;
  activeStep: WinterizeStep | null, 
  winterizeSequence: WinterizeStep[];
  actions: WinterizeStoreActions;
};

const useWinterizeStore = create<WinterizeStoreState>()((set) => ({
    ...initialWinterizeState,
    init: (devices) => set({
      ...initialWinterizeState, // Reset everything, using the initial state
      devices,
    }),
    actions: {
      setSelectedDevice: (selectedDevice: Device) => set((state) => ({
        ...state,
        selectedDevice,
        zones: selectedDevice.zones,
      })),
      addWinterizeSteps: (steps: WinterizeStep[]) => set((state) => ({
        ...state,
        winterizeSequence: [...state.winterizeSequence, ...steps],
      })),
      removeWinterizeSteps: (steps: WinterizeStep[]) => set((state) => ({
        ...state,
        winterizeSequence: state.winterizeSequence.filter(
          (step) => !steps.some((s) => s.id === step.id)
        ),
      })),
      updateWinterizeStep: (id, updatedFields) => set((state) => ({
        ...state,
        winterizeSequence: state.winterizeSequence.map((step) =>
          step.id === id ? { ...step, ...updatedFields } : step
        ),
      })),
      setActiveStep: (activeStep: WinterizeStep | null) => set((state) => ({
        ...state,
        activeStep
      })),
      resetWinterizeSequence: () => set(() => ({
        winterizeSequence: initialWinterizeState.winterizeSequence,
      })),
    },
  })
);

/**
 * useInitializeWinterize is an internal function that initializes the winterize store with data 
 * from the useEntity response. We allow setState to overwrite the state, since this would be a 
 * change in Entity. A new entity would have different devices and zones rendering our existing 
 * store data useless.
 */
const useInitializeWinterize = () => {
  const isAuth = getIsAuth();

  const hydrated = useWinterizeStore(state => state.hydrated);
  const loading = useWinterizeStore(state => state.loading);
  
  const shouldFetchData = isAuth && !hydrated && !loading;
  const { data, isLoading: entityIsLoading, error } = useEntity({
    enabled: shouldFetchData
  });
  
  useEffect(() => {
    if (hydrated || !isAuth) return;
    
    if (loading && !entityIsLoading) {
      useWinterizeStore.setState({ loading: false });
      return; // Exit early and let the next effect run handle initialization
    } 

    if (entityIsLoading) {
      useWinterizeStore.setState({ loading: true, error: null });
      return;
    } 

    if (error) {
      useWinterizeStore.setState({ loading: false, error: error.message });
      return;
    }

    if (data?.devices) {
      const { init } = useWinterizeStore.getState();
      init(data.devices);
      useWinterizeStore.setState({ hydrated: true, loading: false, error: null });
    }
    if (data && !data.devices?.length) {
      useWinterizeStore.setState({ hydrated: true, loading: false, error: "No devices found." });
    }
  }, [hydrated, loading, isAuth, entityIsLoading, data, error]);

  if (!isAuth) return;
};

/**
 * This is the main hook to be used in the app. It will initialize the store if it hasn't been
 * initialized yet. It will also return the state of the store.
 * @param selector the selector functions to be used in the WinterizeStoreState
 * @returns the Zustand useWinerizeStore
 */
const useWinterize = <T>(selector: (state: WinterizeStoreState) => T): T => {
  useInitializeWinterize();
  return useWinterizeStore(selector);
};

export const useWinterizeLoading = () => useWinterize((state) => state.loading);
export const useWinterizeError = () => useWinterize((state) => state.error);
export const useWinterizeHydrated = () => useWinterize((state) => state.hydrated);

export const useDevices = () => useWinterize((state) => state.devices);
export const useZones = () => useWinterize((state) => state.zones);
export const useSelectedDevice = () => useWinterize((state) => state.selectedDevice);
export const useActiveStep = () => useWinterize((state) => state.activeStep);
export const useIsBlowoutRunning = () => useWinterize((state) => !!state.activeStep);
export const useWinterizeSequence = () => useWinterize((state) => state.winterizeSequence);

export const useWinterizeActions = () => useWinterize((state) => state.actions);
