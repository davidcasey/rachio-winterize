import { useWinterizeSequence, useWinterizeActions } from 'app/store/winterizeStore';

export function useDeleteCycle() {
  const winterizeSequence = useWinterizeSequence();
  const { removeWinterizeSteps } = useWinterizeActions();

  function deleteCycle(cycleId: string) {
    const stepsToDelete = winterizeSequence.filter(
      (step) => step.cycleId === cycleId
    );
    removeWinterizeSteps(stepsToDelete);
  }

  return deleteCycle;
}
