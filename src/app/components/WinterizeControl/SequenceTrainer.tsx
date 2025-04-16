import { JSX, useState, useEffect } from 'react';
import { Zone } from 'app/models/rachioModels';
import { useZones } from 'app/store/winterizeStore';
import { useAddStep } from 'app/hooks/useAddStep';

export const SequenceTrainer = (): JSX.Element => {
  const zones = useZones();
  if (!zones || zones.length === 0) {
    return <p>No zones available for training.</p>;
  }

  const [remainingZones, setRemainingZones] = useState<Zone[]>(zones);
  const [skippedZones, setSkippedZones] = useState<Zone[]>([]);

  const [instructions, setInstructions] = useState(true);
  const [isTraining, setIsTraining] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);

  const [blowOutTime, setBlowOutTime] = useState(0);
  const [recoveryTime, setRecoveryTime] = useState(0);

  const [cycleId, setCycleId] = useState(() => crypto.randomUUID());
  const addStep = useAddStep();

  const currentZone = remainingZones[0];
  const nextZone = remainingZones[1];

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTraining && !isRecovering) {
      interval = setInterval(() => setBlowOutTime((t) => t + 1), 1000);
    } else if (isTraining && isRecovering) {
      interval = setInterval(() => setRecoveryTime((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTraining, isRecovering]);

  const handleNext = () => {
    if (!currentZone) return;
    
    if (!isRecovering) {
      // Just switching from blow-out to recovery mode for the current zone
      setIsRecovering(true);
      return;
    }
    
    // Add current step to the store
    addStep({
      zone: currentZone,
      blowOutTime,
      recoveryTime,
      cycleId,
    });
    
    // Process any skipped zones by adding them to the store
    skippedZones.forEach((zone) =>
      addStep({
        zone,
        blowOutTime: 0,
        recoveryTime: 0,
        selected: false,
        cycleId,
      })
    );
    
    // Remove the current zone and any skipped zones from remaining
    const updatedRemaining = remainingZones.slice(1).filter(zone => 
      !skippedZones.some(skipped => skipped.id === zone.id)
    );
    
    // Check if we've processed all zones and need to start over
    if (updatedRemaining.length === 0) {
      // Reset to all zones and generate a new cycle ID
      setRemainingZones(zones);
      setCycleId(crypto.randomUUID());
    } else {
      // Continue with remaining zones
      setRemainingZones(updatedRemaining);
    }
    
    // Clear the skipped zones queue
    setSkippedZones([]);
    
    // Reset timers and recovery state for the next zone
    setBlowOutTime(0);
    setRecoveryTime(0);
    setIsRecovering(false);
  };

  const handleSkip = () => {
    if (!nextZone) return; // Only skip if there is a next zone
    
    // Add the NEXT zone to skipped zones queue, not the current one
    setSkippedZones((prev) => [...prev, nextZone]);
    
    // Remove the next zone from remaining zones, but keep the current one
    setRemainingZones((prev) => [prev[0], ...prev.slice(2)]);
  };

  const handleStart = () => {
    setIsTraining(true);
    setInstructions(false);
    // Reset cycle ID when starting training
    setCycleId(crypto.randomUUID());
  };

  function handleComplete() {
    // Add current zone if it's being processed
    if (currentZone) {
      addStep({
        zone: currentZone,
        blowOutTime,
        recoveryTime,
        cycleId,
      });
    }

    // Push all skipped zones (selected = false)
    skippedZones.forEach((zone) => {
      addStep({
        zone,
        blowOutTime: 0,
        recoveryTime: 0,
        selected: false,
        cycleId,
      });
    });

    // Process any remaining zones as skipped
    if (remainingZones.length > 1) { // Skip the current zone since we processed it above
      remainingZones.slice(1).forEach((zone) => {
        // Only add if not already in skipped zones to avoid duplicates
        if (!skippedZones.some(skipped => skipped.id === zone.id)) {
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

    // Reset to the initial state for next time
    setRemainingZones(zones as Zone[]); // Reset to all zones, starting from the first zone
    setSkippedZones([]);
    setBlowOutTime(0);
    setRecoveryTime(0);
    setIsRecovering(false);
    
    // Exit trainer mode
    setIsTraining(false);
  }

  function renderInstructions() {
    return <p>Press Start to train the app to blow out your sprinkler system.</p>;
  }

  function renderCurrentStep() {
    if (!currentZone) return null;

    return (
      <>
        <h2>Current zone</h2>
        <p>{currentZone.name}</p>
        <table>
          <thead>
            <tr>
              <th className="trainer-state-blow-out">Blow out</th>
              <th className="trainer-state-recovery">Recovery</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{blowOutTime}</td>
              <td>{recoveryTime}</td>
            </tr>
          </tbody>
        </table>
        <button className="trainer-next" onClick={handleNext}>
          Next
        </button>
      </>
    );
  }

  function renderOnDeck() {
    if (!nextZone) return null;

    return (
      <>
        <h3>Up next</h3>
        <p>{nextZone.name}</p>
        <button onClick={handleSkip}>Skip</button>
      </>
    );
  }

  return (
    <>
      <h2>Sequence Trainer</h2>
      {instructions && renderInstructions()}
      {!instructions && (
        <>
          {renderCurrentStep()}
          {renderOnDeck()}
        </>
      )}
      {!isTraining ? (
        <button onClick={handleStart}>Start</button>
      ) : (
        <button onClick={handleComplete}>Complete</button>
      )}
    </>
  );
};
