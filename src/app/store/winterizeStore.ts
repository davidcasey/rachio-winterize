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
  // Timestamp-based tracking
  currentStepIndex: -1,
  currentPhase: 'idle' as 'idle' | 'blowout' | 'recovery',
  phaseStartTime: null as number | null,
  sequenceStartTime: null as number | null,
};

interface WinterizeStoreActions {
  setSelectedDevice: (selectedDevice: Device) => void;
  addWinterizeSteps: (steps: WinterizeStep[]) => void;
  removeWinterizeSteps: (steps: WinterizeStep[]) => void;
  updateWinterizeStep: (id: string, updatedStep: Partial<WinterizeStep>) => void;
  setActiveStep: (activeStep: WinterizeStep | null) => void;
  resetWinterizeSequence: () => void;
  // New actions for timestamp-based tracking
  setCurrentStepIndex: (index: number) => void;
  setCurrentPhase: (phase: 'idle' | 'blowout' | 'recovery') => void;
  setPhaseStartTime: (time: number | null) => void;
  setSequenceStartTime: (time: number | null) => void;
  resetTimingState: () => void;
}

interface WinterizeStoreState {
  // Store
  loading: boolean;
  error: string | null;
  hydrated: boolean;
  init: (devices: Device[]) => void;
  // Rachio
  devices: Device[] | null;
  zones: Zone[] | null;
  // Winterize
  selectedDevice: Device | null;
  activeStep: WinterizeStep | null;
  winterizeSequence: WinterizeStep[];
  // Timestamp-based tracking
  currentStepIndex: number;
  currentPhase: 'idle' | 'blowout' | 'recovery';
  phaseStartTime: number | null;
  sequenceStartTime: number | null;
  actions: WinterizeStoreActions;
}

const useWinterizeStore = create<WinterizeStoreState>()((set) => ({
  ...initialWinterizeState,
  init: (devices) =>
    set({
      ...initialWinterizeState,
      devices,
    }),
  actions: {
    setSelectedDevice: (selectedDevice: Device) =>
      set((state) => ({
        ...state,
        selectedDevice,
        zones: selectedDevice.zones,
      })),
    addWinterizeSteps: (steps: WinterizeStep[]) =>
      set((state) => ({
        ...state,
        winterizeSequence: [...state.winterizeSequence, ...steps],
      })),
    removeWinterizeSteps: (steps: WinterizeStep[]) =>
      set((state) => ({
        ...state,
        winterizeSequence: state.winterizeSequence.filter(
          (step) => !steps.some((s) => s.id === step.id)
        ),
      })),
    updateWinterizeStep: (id, updatedFields) =>
      set((state) => ({
        ...state,
        winterizeSequence: state.winterizeSequence.map((step) =>
          step.id === id ? { ...step, ...updatedFields } : step
        ),
      })),
    setActiveStep: (activeStep: WinterizeStep | null) =>
      set((state) => ({
        ...state,
        activeStep,
      })),
    resetWinterizeSequence: () =>
      set(() => ({
        winterizeSequence: initialWinterizeState.winterizeSequence,
      })),
    // New actions
    setCurrentStepIndex: (index: number) =>
      set((state) => ({
        ...state,
        currentStepIndex: index,
      })),
    setCurrentPhase: (phase: 'idle' | 'blowout' | 'recovery') =>
      set((state) => ({
        ...state,
        currentPhase: phase,
      })),
    setPhaseStartTime: (time: number | null) =>
      set((state) => ({
        ...state,
        phaseStartTime: time,
      })),
    setSequenceStartTime: (time: number | null) =>
      set((state) => ({
        ...state,
        sequenceStartTime: time,
      })),
    resetTimingState: () =>
      set((state) => ({
        ...state,
        currentStepIndex: -1,
        currentPhase: 'idle',
        phaseStartTime: null,
        sequenceStartTime: null,
        activeStep: null,
      })),
  },
}));

/**
 * useInitializeWinterize is an internal function that initializes the winterize store with data
 * from the useEntity response.
 */
const useInitializeWinterize = () => {
  const isAuth = getIsAuth();

  const hydrated = useWinterizeStore((state) => state.hydrated);
  const loading = useWinterizeStore((state) => state.loading);

  const shouldFetchData = isAuth && !hydrated && !loading;
  const { data, isLoading: entityIsLoading, error } = useEntity({
    enabled: shouldFetchData,
  });

  useEffect(() => {
    if (hydrated || !isAuth) return;

    if (loading && !entityIsLoading) {
      useWinterizeStore.setState({ loading: false });
      return;
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
      useWinterizeStore.setState({
        hydrated: true,
        loading: false,
        error: 'No devices found.',
      });
    }
  }, [hydrated, loading, isAuth, entityIsLoading, data, error]);

  if (!isAuth) return;
};

/**
 * Main hook to be used in the app
 */
const useWinterize = <T,>(selector: (state: WinterizeStoreState) => T): T => {
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
export const useIsBlowoutRunning = () =>
  useWinterize((state) => state.currentPhase !== 'idle');
export const useWinterizeSequence = () => useWinterize((state) => state.winterizeSequence);

// New selectors for timestamp tracking
export const useCurrentStepIndex = () => useWinterize((state) => state.currentStepIndex);
export const useCurrentPhase = () => useWinterize((state) => state.currentPhase);
export const usePhaseStartTime = () => useWinterize((state) => state.phaseStartTime);
export const useSequenceStartTime = () => useWinterize((state) => state.sequenceStartTime);

export const useWinterizeActions = () => useWinterize((state) => state.actions);
