import { useCallback } from 'react';
import { Zone } from 'app/models/rachioModels';
import { WinterizeStep } from 'app/models/winterizeModels';
import { useWinterizeActions } from 'app/store/winterizeStore'

export const useAddWinterizeCycle = () => {
  const { addWinterizeSteps } = useWinterizeActions();

  return useCallback(
    (
      zones: Zone | Zone[],
      blowOutTime: number,
      recoveryTime: number,
    ) => {
      const zoneList = Array.isArray(zones) ? zones : [zones];
      const cycleId = crypto.randomUUID(); 

      const steps: WinterizeStep[] = zoneList.map((zone) => ({
        id: crypto.randomUUID(),
        name: zone.name,
        active: false,
        selected: true,
        blowOutTime,
        recoveryTime,
        zone,
        cycleId,
      }));

      addWinterizeSteps(steps);
    },
    [addWinterizeSteps]
  );
};
