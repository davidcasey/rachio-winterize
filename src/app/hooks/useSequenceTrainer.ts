import { useState, useEffect } from 'react';
import { Zone } from 'app/models/rachioModels';
import { useAddStep } from 'app/hooks/useAddStep';
import { useZones } from 'app/store/winterizeStore';

export const useSequenceTrainer = () => {
  const zones = useZones();
  const addStep = useAddStep();

  if (!zones || zones.length === 0) {
    return { error: 'No zones available for training.' };
  }

  const [remainingZones, setRemainingZones] = useState<Zone[]>(zones);
  const [skippedZones, setSkippedZones] = useState<Zone[]>([]);
  const [cycleId, setCycleId] = useState(() => crypto.randomUUID());

  const [blowOutTime, setBlowOutTime] = useState(0);
  const [recoveryTime, setRecoveryTime] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);

  const currentZone = remainingZones[0];
  const nextZone = remainingZones[1];

  // Timer hook
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTraining && !isRecovering) {
      interval = setInterval(() => setBlowOutTime((t) => t + 1), 1000);
    } else if (isTraining && isRecovering) {
      interval = setInterval(() => setRecoveryTime((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTraining, isRecovering]);

  const startTraining = () => {
    setIsTraining(true);
    setCycleId(crypto.randomUUID());
  };

  const completeTraining = () => {
    if (currentZone) {
      addStep({ zone: currentZone, blowOutTime, recoveryTime, cycleId });
    }

    skippedZones.forEach((zone) => {
      addStep({
        zone,
        blowOutTime: 0,
        recoveryTime: 0,
        selected: false,
        cycleId,
      });
    });

    if (remainingZones.length > 1) {
      remainingZones.slice(1).forEach((zone) => {
        if (!skippedZones.some((skipped) => skipped.id === zone.id)) {
          addStep({
            zone,
            blowOutTime: 0,
            recoveryTime: 0,
            selected: false,
            cycleId,
          });
        }
      });
    }

    resetTrainerState();
  };

  const handleNext = () => {
    if (!currentZone) return;

    if (!isRecovering) {
      setIsRecovering(true);
      return;
    }

    addStep({
      zone: currentZone,
      blowOutTime,
      recoveryTime,
      cycleId,
    });

    skippedZones.forEach((zone) =>
      addStep({
        zone,
        blowOutTime: 0,
        recoveryTime: 0,
        selected: false,
        cycleId,
      })
    );

    const updatedRemaining = remainingZones.slice(1).filter((zone) =>
      !skippedZones.some((skipped) => skipped.id === zone.id)
    );

    if (updatedRemaining.length === 0) {
      setRemainingZones(zones);
      setCycleId(crypto.randomUUID());
    } else {
      setRemainingZones(updatedRemaining);
    }

    setSkippedZones([]);
    resetTimers();
    setIsRecovering(false);
  };

  const handleSkip = () => {
    if (!nextZone) return;

    setSkippedZones((prev) => [...prev, nextZone]);

    setRemainingZones((prev) => [prev[0], ...prev.slice(2)]);
  };

  const resetTimers = () => {
    setBlowOutTime(0);
    setRecoveryTime(0);
  };

  const resetTrainerState = () => {
    setRemainingZones(zones);
    setSkippedZones([]);
    resetTimers();
    setIsRecovering(false);
    setIsTraining(false);
  };

  return {
    remainingZones,
    skippedZones,
    cycleId,
    currentZone,
    nextZone,
    blowOutTime,
    recoveryTime,
    isTraining,
    isRecovering,
    startTraining,
    completeTraining,
    handleNext,
    handleSkip,
    error: null,
  };
};
