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

  const [remainingZones, setRemainingZones] = useState<Zone[]>([...zones]);
  const [skippedZones, setSkippedZones] = useState<Zone[]>([]);
  const [cycleId, setCycleId] = useState(() => crypto.randomUUID());
  const [noMoreZones, setNoMoreZones] = useState(false);

  const [blowOutTime, setBlowOutTime] = useState(0);
  const [recoveryTime, setRecoveryTime] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);

  const currentZone = remainingZones.length > 0 ? remainingZones[0] : null;
  
  // Determine the next zone, wrapping around to the beginning if needed
  const nextZone = remainingZones.length > 1 
    ? remainingZones[1] 
    : (currentZone && zones.length > 1 
        ? zones.find(zone => zone.id !== currentZone.id && !skippedZones.some(sz => sz.id === zone.id)) || null
        : null);

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
    setNoMoreZones(false);
  };

  const completeTraining = () => {
    if (!currentZone) return;

    // Record the current zone's timing
    addStep({
      zone: currentZone,
      blowOutTime,
      recoveryTime,
      cycleId,
    });

    // Get all processed zone IDs so far
    const processedZoneIds = [currentZone.id];
    
    // Track how many zones we've processed in the current cycle
    let zonesInCurrentCycle = 1; // Start with 1 for the current zone
    
    // Add skipped zones up to completing one full cycle
    for (const skippedZone of skippedZones) {
      // Only add skipped zones until we reach the total zones count
      if (zonesInCurrentCycle < zones.length) {
        addStep({
          zone: skippedZone,
          blowOutTime: 0,
          recoveryTime: 0,
          selected: false,
          cycleId,
        });
        
        processedZoneIds.push(skippedZone.id);
        zonesInCurrentCycle++;
      }
    }
    
    // Add any zones that haven't been processed yet, but only up to completing one cycle
    for (const zone of zones) {
      if (!processedZoneIds.includes(zone.id) && zonesInCurrentCycle < zones.length) {
        addStep({
          zone,
          blowOutTime: 0,
          recoveryTime: 0,
          selected: false,
          cycleId,
        });
        zonesInCurrentCycle++;
      }
    }

    resetTrainerState();
  };

  const handleNext = () => {
    if (!currentZone) return;

    if (!isRecovering) {
      setIsRecovering(true);
      return;
    }

    // If there are no more zones, complete the training
    if (noMoreZones) {
      completeTraining();
      return;
    }

    // Record the current zone's timing
    addStep({
      zone: currentZone,
      blowOutTime,
      recoveryTime,
      cycleId,
    });

    // Calculate how many zones we've processed so far in this cycle
    const processedZoneIds = [currentZone.id, ...skippedZones.map(z => z.id)];
    
    // Remove current zone from remaining zones
    let updatedRemaining = remainingZones.slice(1);
    
    // If we've processed all zones or have no more remaining, complete the training
    if (processedZoneIds.length >= zones.length || updatedRemaining.length === 0) {
      // We need to make sure we haven't double-counted zones across cycles
      const uniqueProcessedIds = [...new Set(processedZoneIds)];
      
      // If we've processed all unique zones, complete the training
      if (uniqueProcessedIds.length >= zones.length) {
        completeTraining();
        return;
      }
    }

    // Continue with the current cycle
    setRemainingZones(updatedRemaining);
    setSkippedZones([]);
    resetTimers();
    setIsRecovering(false);
    setNoMoreZones(false);
  };

  const handleSkip = () => {
    if (!currentZone || !nextZone) return;
    
    // Add the next zone to skipped zones, but only if it's not already skipped
    if (!skippedZones.some(z => z.id === nextZone.id)) {
      setSkippedZones(prev => [...prev, nextZone]);
    }
    
    // Remove the skipped zone from remaining zones
    const newRemaining = [currentZone, ...remainingZones.slice(2)];

    // Check if after this skip, there would be no more zones left to show
    const updatedSkippedZoneIds = [...skippedZones.map(z => z.id), nextZone.id];
    
    // Only count zones that would be part of this cycle
    const processedAndSkippedInThisCycle = new Set([currentZone.id, ...updatedSkippedZoneIds]);
    const remainingForThisCycle = zones.filter(zone => !processedAndSkippedInThisCycle.has(zone.id));
    
    if (remainingForThisCycle.length === 0) {
      setNoMoreZones(true);
    } else if (newRemaining.length <= 1) {
      // If we need to find a new next zone after skipping
      const nextAvailableZone = remainingForThisCycle[0];
      
      if (nextAvailableZone) {
        newRemaining.push(nextAvailableZone);
      }
    }
    
    setRemainingZones(newRemaining);
  };

  const resetTimers = () => {
    setBlowOutTime(0);
    setRecoveryTime(0);
  };

  const resetTrainerState = () => {
    setRemainingZones([...zones]);
    setSkippedZones([]);
    resetTimers();
    setIsRecovering(false);
    setIsTraining(false);
    setNoMoreZones(false);
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
    noMoreZones,
    error: null,
  };
};
