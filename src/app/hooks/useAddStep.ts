import { useCallback } from 'react';
import { Zone } from 'app/models/rachioModels';
import { WinterizeStep } from 'app/models/winterizeModels';
import { useWinterizeActions } from 'app/store/winterizeStore';

/**
 * Add a single winterize step to the store
 */

type StepInput = {
  zone: Zone;
  blowOutTime: number;
  recoveryTime: number;
  cycleId: string;
  selected?: boolean;
};
export const useAddStep = () => {
  const { addWinterizeSteps } = useWinterizeActions();

  return useCallback(
    ({ zone, blowOutTime, recoveryTime, selected = true, cycleId }: StepInput) => {
      const step: WinterizeStep = {
        id: crypto.randomUUID(),
        name: zone.name,
        active: false,
        selected,
        blowOutTime,
        recoveryTime,
        zone,
        cycleId,
      };

      addWinterizeSteps([step]);
    },
    [addWinterizeSteps]
  );
};
