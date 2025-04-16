import { useCallback } from 'react';
import { useWinterizeSequence, useWinterizeActions } from 'app/store/winterizeStore';
import { WinterizeStep } from 'app/models/winterizeModels';

/**
 * Hook to duplicate a specific cycle by its cycleId
 */
export const useAddDuplicateCycle = () => {
  const { addWinterizeSteps } = useWinterizeActions();
  const winterizeSequence = useWinterizeSequence();

  return useCallback(
    (cycleId: string) => {
      const stepsToDuplicate = winterizeSequence.filter(step => step.cycleId === cycleId);
      if (stepsToDuplicate.length === 0) return;

      const newCycleId = crypto.randomUUID();
      const duplicatedSteps: WinterizeStep[] = stepsToDuplicate.map(step => ({
        ...step,
        id: crypto.randomUUID(),
        cycleId: newCycleId,
      }));

      addWinterizeSteps(duplicatedSteps);
    },
    [addWinterizeSteps, winterizeSequence]
  );
};

/**
 * Hook to find the most recent cycle and duplicate it using useAddDuplicateCycle()
 */
export const useAddDuplicatePreviousCycle = () => {
  const winterizeSequence = useWinterizeSequence();
  const duplicateCycle = useAddDuplicateCycle();

  const duplicateLastCycle = useCallback(() => {
    const lastCycleId = winterizeSequence.at(-1)?.cycleId;
    if (lastCycleId) {
      duplicateCycle(lastCycleId);
    }
  }, [winterizeSequence, duplicateCycle]);

  const hasPreviousCycle = winterizeSequence.length > 0;

  return { duplicateLastCycle, hasPreviousCycle };
};
