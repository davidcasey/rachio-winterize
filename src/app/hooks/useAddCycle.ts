import { useCallback } from 'react';
import { Zone } from 'app/models/rachioModels';
import { WinterizeStep } from 'app/models/winterizeModels';
import { useWinterizeActions } from 'app/store/winterizeStore';

/**
 * Add a cycle of winterize steps to the store
 */

export const useAddCycle = () => {
  const { addWinterizeSteps } = useWinterizeActions();

  return useCallback(
    (
      zones: Zone | Zone[],
      blowOutTime: number,
      recoveryTime: number,
    ) => {
      const inputList = Array.isArray(zones) ? zones : [zones];
      const cycleId = crypto.randomUUID(); 

      const steps: WinterizeStep[] = inputList.map((zone) => ({
        id: crypto.randomUUID(),
        name: zone.name,
        active: false,
        selected: true,
        blowOutTime,
        recoveryTime,
        cycleId,
        zone,
      }));

      addWinterizeSteps(steps);
    },
    [addWinterizeSteps]
  );
};
