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
