import { useEffect } from 'react';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

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
  winterizeSequence: null,
};

interface WinterizeStoreActions {
  setSelectedDevice: (selectedDevice: Device) => void;
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
  activeStep: WinterizeStep | null;
  actions: WinterizeStoreActions;
};

const useWinterizeStore = create<WinterizeStoreState>()(
  devtools((set) => ({
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
    },
  }))
);

/**
 * useInitializeWinterize is an internal function that initializes the winterize store with data 
 * from the useEntity response. We allow setState to overwrite the state, since this would be a 
 * change in Entity. A new entity would have different devices and zones rendering our existing 
 * store data useless.
 */
const useInitializeWinterize = () => {
  const isAuth = getIsAuth();
  if (!isAuth) return;

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
export const useSelectedDevice = () => useWinterize((state) => state.selectedDevice);
export const useZones = () => useWinterize((state) => state.zones);

export const useWinterizeActions = () => useWinterize((state) => state.actions);


      
      /*
      setActiveStep: (activeStep: WinterizeStep) => set((state) => ({
        ...state,
        activeStep,
      })),
      addWinterizeStep: (step: WinterizeStep) => set((state) => ({
        winterizeSequence: {
          ...state.winterizeSequence,
          steps: [...(state.winterizeSequence?.steps || []), step],
        },
      })),
      */

/*
function initializeData(token: string) {
  fetchEntityId().then(entity => {
    fetchEntity(entity.id).then(info => {
      let deviceActiveZones = info.devices.map(device => {
        return {
          name: device.name,
          id: device.id,
          latitude: device.latitude,
          longitude: device.longitude,
          zones: device.zones.filter(zone => zone.enabled).sort((a, b) => a.zoneNumber - b.zoneNumber),
        }
      });
      setDevices(deviceActiveZones);
    });
  }
)}
*/