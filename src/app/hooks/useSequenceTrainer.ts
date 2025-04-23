import { useReducer, useEffect } from 'react';
import { useZones } from 'app/store/winterizeStore';
import { useAddStep } from 'app/hooks/useAddStep';
import { trainerReducer, initialState } from 'app/hooks/trainerReducer';

export const useSequenceTrainer = () => {
  const zones = useZones() ?? [];
  const [state, dispatch] = useReducer(trainerReducer, initialState);
  const addStep = useAddStep();

  useEffect(() => {
    if (zones.length > 0 && state.isTraining) {
      const interval = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [zones.length, state.isTraining]);

  const currentZone = zones[state.currentIndex] || null;
  const nextZone = zones[state.nextIndex] || null;
  const noMoreZones = state.nextIndex === state.currentIndex;

  const startTraining = () => {
    dispatch({ type: 'START_TRAINING', zoneCount: zones.length });
  };

  const handleNext = () => {
    if (!currentZone) return;

    // If no more zones, complete the training regardless of blowout/recovery status
    if (noMoreZones) {
      completeTraining();
      return;
    }

    // If in blowout, switch to recovery (don't go to the next zone yet)
    if (!state.isRecovering) {
      dispatch({ type: 'SWITCH_TO_RECOVERY' });
      return;
    }

    // If in recovery, proceed to the next zone
    addStep({
      zone: currentZone,
      blowOutTime: state.blowOutTime,
      recoveryTime: state.recoveryTime,
      cycleId: state.cycleId,
    });

    // Handle skipped zones before proceeding if nextIndex isn't sequential
    const expectedNextIndex = (state.currentIndex + 1) % zones.length;
    if (state.nextIndex !== expectedNextIndex) {
      let index = expectedNextIndex;
      while (index !== state.nextIndex) {
        const skippedZone = zones[index];
        addStep({
          zone: skippedZone,
          blowOutTime: 0,
          recoveryTime: 0,
          cycleId: state.cycleId,
          selected: false,
        });
        index = (index + 1) % zones.length;
      }
    }

    dispatch({ type: 'NEXT_ZONE' });
  };

  const handleSkip = () => {
    if (!nextZone || state.nextIndex === state.currentIndex) return;
    dispatch({ type: 'SKIP_ZONE' });
  };

  const completeTraining = () => {
    if (currentZone) {
      addStep({
        zone: currentZone,
        blowOutTime: state.blowOutTime,
        recoveryTime: state.recoveryTime || 0,
        cycleId: state.cycleId,
      });
    }

    // Complete remaining zones
    const remainingZones = zones.slice(state.currentIndex + 1);
    remainingZones.forEach((zone) => {
      addStep({
        zone,
        blowOutTime: 0,
        recoveryTime: 0,
        selected: false,
        cycleId: state.cycleId,
      });
    });

    dispatch({ type: 'RESET' });
  };

  return {
    currentZone,
    nextZone,
    blowOutTime: state.blowOutTime,
    recoveryTime: state.recoveryTime,
    isTraining: state.isTraining,
    isRecovering: state.isRecovering,
    noMoreZones,
    startTraining,
    handleNext,
    handleSkip,
    completeTraining,
    error: zones.length === 0 ? 'No zones available for training.' : null,
  };
};
