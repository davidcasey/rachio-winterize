import { JSX } from 'react';
import { useSequenceTrainer } from 'app/hooks/useSequenceTrainer';

export const SequenceTrainer = (): JSX.Element => {
  const {
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
    error,
  } = useSequenceTrainer();

  if (error) {
    return <p>{error}</p>;  // Display the error message if there are no zones
  }

  function renderInstructions() {
    return (
      <>
        <p>You’ve entered training mode for your sprinkler system blowout!</p>
        <p>Before starting, ensure your air compressor is ready and all hoses and pipes are securely connected. The blowout and training will begin immediately once you press “Start.”</p>
        <p>Press “Next” to move on to the next step or zone.</p>
        <p>Press “Skip” to skip one or more zones while the current zone is still in progress.</p>
        <p>Press “Complete” to finish the training. All results will be displayed in the table.</p>
        <p>Upon completion, fine-tune any of the learned values in the table as needed. Edits are saved instantly.</p>
      </>
    )
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
              <th className={isRecovering ? '' : 'active'}>Blow out</th>
              <th className={isRecovering ? 'active' : ''}>Recovery</th>
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
      {!isTraining ? (
        <>
          {renderInstructions()}
          <button onClick={startTraining}>Start</button>
        </>
      ) : (
        <>
          {renderCurrentStep()}
          {renderOnDeck()}
          <button onClick={completeTraining}>Complete</button>
        </>
      )}
    </>
  );
};
