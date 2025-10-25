import { useEffect, useRef } from 'react';
import { useStartZoneWatering, useStopWatering } from 'app/services/rachio-services';
import {
  useSelectedDevice,
  useWinterizeSequence,
  useIsBlowoutRunning,
  useActiveStep,
  useWinterizeActions,
} from 'app/store/winterizeStore';

/**
 * useBlowout
 * This hook manages the sequencing of blowout steps with delay between each.
 */
export const useBlowout = () => {
  // winterizeStore
  const selectedDevice = useSelectedDevice();
  const winterizeSequence = useWinterizeSequence();
  const isRunning = useIsBlowoutRunning();
  const activeStep = useActiveStep();
  const { setActiveStep } = useWinterizeActions();
  // rachio service hooks
  const startZoneWatering = useStartZoneWatering();
  const stopWatering = useStopWatering();

  const stepIndexRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Run Next Step
   */
  const runNextStep = async () => {
    if (!selectedDevice) return;
  
    // Find the next selected step starting from current index
    let step = winterizeSequence[stepIndexRef.current];
    while (step && !step.selected) {
      stepIndexRef.current += 1;
      step = winterizeSequence[stepIndexRef.current];
    }

    if (!step) {
      stopBlowout(); // Ensure blowout is stopped if there are no more steps
      return;
    }
    
    setActiveStep(step);
    // Start zone watering
    try {
      await startZoneWatering.mutateAsync({ zoneId: step.zone.id, duration: step.blowOutTime });
    } catch (err) {
      console.error('Failed to start zone:', err);
      stopBlowout(); // Fail-safe
      return;
    }
    // Immediately after starting watering, stop watering after the duration ends
    timerRef.current = setTimeout(async () => {
      // Stop watering once the blowOutTime has passed
      await stopWatering.mutateAsync(selectedDevice.id);
      // Wait for the recovery time (recharge) before starting the next step
      timerRef.current = setTimeout(() => {
        stepIndexRef.current += 1;
        setActiveStep(null);
        runNextStep();
      }, step.recoveryTime * 1000);
    }, step.blowOutTime * 1000);
  };

  /**
   * Start Blowout
   */
  const startBlowout = () => {
    if (isRunning || winterizeSequence.length === 0) return;
    stepIndexRef.current = 0;
    runNextStep();
  };
  
  /**
   * Stop Blowout
   */
  const stopBlowout = async () => {
    if (!selectedDevice) return;
    // Clear the active timeout if any exists
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = null;
    // Immediately stop watering (to ensure any active zone watering is halted)
    if (activeStep) {
      await stopWatering.mutateAsync(selectedDevice.id);
    }
    // Reset active step and any other states related to the flow
    setActiveStep(null);
    stepIndexRef.current = 0;
  };

  /**
   * If a component using useBlowout gets unmounted while a blowout sequence is running or
   * scheduled, this clears any setTimeout that would otherwise fire after the component is gone.
   */
  useEffect(() => {
    return () => {
      // Clean up on unmount
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = null;
    };
  }, []);

  return {
    isBlowoutRunning: isRunning,
    activeStep,
    startBlowout,
    stopBlowout,
  };
};
