import { useEffect, useRef, useCallback } from 'react';
import { useStartZoneWatering, useStopWatering } from 'app/services/rachio-services';
import {
  useSelectedDevice,
  useWinterizeSequence,
  useIsBlowoutRunning,
  useActiveStep,
  useWinterizeActions,
  useCurrentStepIndex,
  useCurrentPhase,
  usePhaseStartTime,
} from 'app/store/winterizeStore';

/**
 * useBlowout
 * This hook manages the sequencing of blowout steps using timestamp-based tracking
 * to ensure accurate timing even when the app is backgrounded.
 */
export const useBlowout = () => {
  const selectedDevice = useSelectedDevice();
  const winterizeSequence = useWinterizeSequence();
  const isRunning = useIsBlowoutRunning();
  const activeStep = useActiveStep();
  const currentStepIndex = useCurrentStepIndex();
  const currentPhase = useCurrentPhase();
  const phaseStartTime = usePhaseStartTime();

  const {
    setActiveStep,
    setCurrentStepIndex,
    setCurrentPhase,
    setPhaseStartTime,
    setSequenceStartTime,
    resetTimingState,
  } = useWinterizeActions();

  const startZoneWatering = useStartZoneWatering();
  const stopWatering = useStopWatering();

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isProcessingRef = useRef(false);

  /**
   * Clear any active timer
   */
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  /**
   * Find the next selected step starting from the given index
   */
  const findNextSelectedStep = useCallback(
    (startIndex: number) => {
      for (let i = startIndex; i < winterizeSequence.length; i++) {
        if (winterizeSequence[i].selected) {
          return { step: winterizeSequence[i], index: i };
        }
      }
      return null;
    },
    [winterizeSequence]
  );

  /**
   * Stop the blowout sequence
   */
  const stopBlowout = useCallback(async () => {
    if (!selectedDevice) return;

    clearTimer();
    isProcessingRef.current = false;

    // Stop any active watering
    if (activeStep) {
      try {
        await stopWatering.mutateAsync(selectedDevice.id);
      } catch (err) {
        console.error('Failed to stop watering:', err);
      }
    }

    // Reset all timing state
    resetTimingState();
  }, [selectedDevice, activeStep, stopWatering, resetTimingState, clearTimer]);

  /**
   * Start the blowout phase for a step
   */
  const startBlowoutPhase = useCallback(
    async (step: typeof winterizeSequence[0], index: number) => {
      if (!selectedDevice || isProcessingRef.current) return;

      isProcessingRef.current = true;
      setCurrentStepIndex(index);
      setActiveStep(step);
      setCurrentPhase('blowout');
      setPhaseStartTime(Date.now());

      try {
        await startZoneWatering.mutateAsync({
          zoneId: step.zone.id,
          duration: step.blowOutTime,
        });
      } catch (err) {
        console.error('Failed to start zone:', err);
        await stopBlowout();
        return;
      }

      isProcessingRef.current = false;
    },
    [
      selectedDevice,
      startZoneWatering,
      setCurrentStepIndex,
      setActiveStep,
      setCurrentPhase,
      setPhaseStartTime,
      stopBlowout,
    ]
  );

  /**
   * Start the recovery phase for a step
   */
  const startRecoveryPhase = useCallback(
    async () => {
      if (!selectedDevice || isProcessingRef.current) return;

      isProcessingRef.current = true;
      setCurrentPhase('recovery');
      setPhaseStartTime(Date.now());

      try {
        await stopWatering.mutateAsync(selectedDevice.id);
      } catch (err) {
        console.error('Failed to stop watering:', err);
      }

      isProcessingRef.current = false;
    },
    [selectedDevice, stopWatering, setCurrentPhase, setPhaseStartTime]
  );

  /**
   * Move to the next step in the sequence
   */
  const moveToNextStep = useCallback(() => {
    const nextStepData = findNextSelectedStep(currentStepIndex + 1);

    if (!nextStepData) {
      // No more steps, stop the sequence
      stopBlowout();
      return;
    }

    setActiveStep(null);
    startBlowoutPhase(nextStepData.step, nextStepData.index);
  }, [currentStepIndex, findNextSelectedStep, stopBlowout, setActiveStep, startBlowoutPhase]);

  /**
   * Check and update the current phase based on elapsed time
   */
  const checkPhaseProgress = useCallback(() => {
    if (!phaseStartTime || currentPhase === 'idle' || !activeStep) {
      return;
    }

    const elapsed = Date.now() - phaseStartTime;

    if (currentPhase === 'blowout') {
      const blowoutDuration = activeStep.blowOutTime * 1000;
      if (elapsed >= blowoutDuration) {
        // Blowout phase complete, start recovery
        startRecoveryPhase();
      } else {
        // Schedule next check
        const remaining = blowoutDuration - elapsed;
        timerRef.current = setTimeout(checkPhaseProgress, Math.min(remaining + 100, 1000));
      }
    } else if (currentPhase === 'recovery') {
      const recoveryDuration = activeStep.recoveryTime * 1000;
      if (elapsed >= recoveryDuration) {
        // Recovery phase complete, move to next step
        moveToNextStep();
      } else {
        // Schedule next check
        const remaining = recoveryDuration - elapsed;
        timerRef.current = setTimeout(checkPhaseProgress, Math.min(remaining + 100, 1000));
      }
    }
  }, [phaseStartTime, currentPhase, activeStep, startRecoveryPhase, moveToNextStep]);

  /**
   * Start the blowout sequence
   */
  const startBlowout = useCallback(() => {
    if (isRunning || winterizeSequence.length === 0) return;

    const firstStepData = findNextSelectedStep(0);
    if (!firstStepData) {
      console.warn('No selected steps found');
      return;
    }

    setSequenceStartTime(Date.now());
    startBlowoutPhase(firstStepData.step, firstStepData.index);
  }, [
    isRunning,
    winterizeSequence.length,
    findNextSelectedStep,
    setSequenceStartTime,
    startBlowoutPhase,
  ]);

  /**
   * Effect to manage phase progression
   */
  useEffect(() => {
    if (currentPhase === 'idle' || !phaseStartTime) {
      clearTimer();
      return;
    }

    // Check immediately
    checkPhaseProgress();

    return () => {
      clearTimer();
    };
  }, [currentPhase, phaseStartTime, checkPhaseProgress, clearTimer]);

  /**
   * Effect to handle visibility changes and resume from correct position
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isRunning) {
        // When page becomes visible again, trigger a check
        // The checkPhaseProgress function will calculate elapsed time and act accordingly
        clearTimer();
        checkPhaseProgress();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isRunning, checkPhaseProgress, clearTimer]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      clearTimer();
      isProcessingRef.current = false;
    };
  }, [clearTimer]);

  return {
    isBlowoutRunning: isRunning,
    activeStep,
    currentPhase,
    startBlowout,
    stopBlowout,
  };
};
