import { useState, useEffect } from 'react';
import {
  useActiveStep,
  useCurrentPhase,
  usePhaseStartTime,
} from 'app/store/winterizeStore';

/**
 * useBlowoutCountdown
 * 
 * Optional hook that provides countdown timers for the current phase.
 * Use this in your UI components if you want to display remaining time.
 * 
 * @returns {Object} - Countdown information
 * @returns {number} remainingSeconds - Seconds remaining in current phase
 * @returns {number} totalSeconds - Total duration of current phase
 * @returns {number} progress - Progress percentage (0-100)
 * @returns {string} phaseLabel - Human-readable phase label
 */
export const useBlowoutCountdown = () => {
  const activeStep = useActiveStep();
  const currentPhase = useCurrentPhase();
  const phaseStartTime = usePhaseStartTime();

  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);

  useEffect(() => {
    if (!activeStep || !phaseStartTime || currentPhase === 'idle') {
      setRemainingSeconds(0);
      setTotalSeconds(0);
      return;
    }

    const updateCountdown = () => {
      const elapsed = Date.now() - phaseStartTime;
      const duration =
        currentPhase === 'blowout'
          ? activeStep.blowOutTime * 1000
          : activeStep.recoveryTime * 1000;

      const remaining = Math.max(0, duration - elapsed);
      setRemainingSeconds(Math.ceil(remaining / 1000));
      setTotalSeconds(Math.ceil(duration / 1000));
    };

    // Update immediately
    updateCountdown();

    // Update every 100ms for smooth countdown
    const interval = setInterval(updateCountdown, 100);

    return () => clearInterval(interval);
  }, [activeStep, currentPhase, phaseStartTime]);

  const progress = totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0;

  const phaseLabel =
    currentPhase === 'blowout'
      ? 'Blowing out'
      : currentPhase === 'recovery'
        ? 'Recovery'
        : 'Idle';

  return {
    remainingSeconds,
    totalSeconds,
    progress,
    phaseLabel,
    isActive: currentPhase !== 'idle',
  };
};
