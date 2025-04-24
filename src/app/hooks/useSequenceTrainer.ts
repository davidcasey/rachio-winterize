import { useReducer, useEffect } from 'react';
import { useStopWatering, useStartZoneWatering } from 'app/services/rachio-services';
import { useZones, useSelectedDevice } from 'app/store/winterizeStore';
import { DEFAULT_MAX_BLOW_OUT_TIME } from 'app/constants/winterizeDefaults';
import { sequenceTrainerReducer, initialState } from 'app/reducers/SequenceTrainerReducer';
import { useAddStep } from 'app/hooks/useAddStep';

export const useSequenceTrainer = () => {
  const [state, dispatch] = useReducer(sequenceTrainerReducer, initialState);
  const stopWatering = useStopWatering();
  const startWatering = useStartZoneWatering();
  const zones = useZones() ?? [];
  const selectedDevice = useSelectedDevice();
  const addStep = useAddStep();

  if (!zones || zones.length === 0) {
    return { error: 'No zones available for training.' };
  }
  if (!selectedDevice) {
    return { error: 'No selected device available for training.' };
  }

  useEffect(() => {
    if (!state.isTraining || zones.length === 0) return;
    const interval = setInterval(() => {
      if (!state.isRecovering) {
        if (state.blowOutTime < DEFAULT_MAX_BLOW_OUT_TIME) {
          dispatch({ type: 'TICK' });
        }
      } else {
        dispatch({ type: 'TICK' });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [zones.length, state.isTraining, state.isRecovering, state.blowOutTime]);

  const currentZone = zones[state.currentIndex] || null;
  const nextZone = zones[state.nextIndex] || null;
  const noMoreZones = state.nextIndex === state.currentIndex;

  const startTraining = async () => {
    await startWatering.mutateAsync({ zoneId: zones[0].id, duration: DEFAULT_MAX_BLOW_OUT_TIME });

    dispatch({ type: 'START_TRAINING', zoneCount: zones.length });
  };

  const handleNext = async () => {
    if (!currentZone) return;

    // If no more zones, complete the training regardless of blowout/recovery status
    if (noMoreZones) {
      completeTraining();
      return;
    }

    // If in blowout, switch to recovery (don't go to the next zone yet)
    if (!state.isRecovering) {
      await stopWatering.mutateAsync(selectedDevice.id);

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

    await startWatering.mutateAsync({
      zoneId: zones[state.nextIndex].id,
      duration: DEFAULT_MAX_BLOW_OUT_TIME,
    });

    dispatch({ type: 'NEXT_ZONE' });
  };

  const handleSkip = () => {
    if (!nextZone || state.nextIndex === state.currentIndex) return;
    dispatch({ type: 'SKIP_ZONE' });
  };

  const completeTraining = async () => {
    await stopWatering.mutateAsync(selectedDevice.id);

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
    error: null,
  };
};
