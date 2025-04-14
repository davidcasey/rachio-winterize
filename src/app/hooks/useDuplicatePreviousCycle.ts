import { useCallback } from 'react';
import { useWinterizeSequence, useWinterizeActions } from 'app/store/winterizeStore';
import { WinterizeStep } from 'app/models/winterizeModels';

export const useDuplicatePreviousCycle = () => {
  const winterizeSequence = useWinterizeSequence();
  const { addWinterizeSteps } = useWinterizeActions();

  const duplicateLastCycle = useCallback(() => {
    if (winterizeSequence.length === 0) return;

    // Step 1: Find the most recent cycleId
    const seen = new Set<string>();
    let lastCycleId: string | undefined;

    for (let i = winterizeSequence.length - 1; i >= 0; i--) {
      const step = winterizeSequence[i];
      if (!seen.has(step.cycleId)) {
        lastCycleId = step.cycleId;
        break;
      }
      seen.add(step.cycleId);
    }

    if (!lastCycleId) return;

    // Step 2: Extract steps in that cycle
    const lastCycleSteps = winterizeSequence.filter(step => step.cycleId === lastCycleId);

    // Step 3: Build duplicated steps with new ids
    const newCycleId = crypto.randomUUID();
    const duplicatedSteps: WinterizeStep[] = lastCycleSteps.map(step => ({
      ...step,
      id: crypto.randomUUID(),
      cycleId: newCycleId,
    }));

    // Step 4: Add to store
    addWinterizeSteps(duplicatedSteps);
  }, [winterizeSequence, addWinterizeSteps]);

  const hasPreviousCycle = winterizeSequence.length > 0;

  return { duplicateLastCycle, hasPreviousCycle };
};
