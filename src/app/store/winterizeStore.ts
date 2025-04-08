import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { Entity, EntityInfo, Device, Zone } from 'app/models/rachioModels';
import { WinterizeSettings, WinterizeSequence, WinterizeStep } from 'app/models/winterizeModels';

interface WinterizeStoreActions {
  setSelectedDevice: (selectedDevice: Device) => void;
  setActiveStep: (activeStep: WinterizeStep) => void;
}
interface WinterizeStoreState {
  winterizeSequence: WinterizeSequence | null;
  selectedDevice: Device | null;
  activeStep: WinterizeStep | null;
  actions: WinterizeStoreActions;
};

const useWinterizeStore = create<WinterizeStoreState>()(
  devtools((set) => ({
    selectedDevice: null,
    winterizeSequence: null,
    activeStep: null,
    actions: {
      setSelectedDevice: (selectedDevice: Device) => set((state) => ({
        ...state,
        selectedDevice,
      })),
      /*
      addWinterizeStep: (step: WinterizeStep) => set((state) => ({
        winterizeSequence: {
          ...state.winterizeSequence,
          steps: [...(state.winterizeSequence?.steps || []), step],
        },
      })),
      */
      setActiveStep: (activeStep: WinterizeStep) => set((state) => ({
        ...state,
        activeStep,
      })),
    },
  }))
);

export const useWinterizeActions = () => useWinterizeStore((state) => state.actions);

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