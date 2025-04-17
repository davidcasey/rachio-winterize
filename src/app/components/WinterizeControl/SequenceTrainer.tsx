import { JSX } from 'react';
import { Button, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { useSequenceTrainer } from 'app/hooks/useSequenceTrainer';

export const SequenceTrainer = ({ onClose }: { onClose: () => void }): JSX.Element => {
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
        <p>Before starting, ensure your air compressor is ready and all hoses are securely connected. The blowout and training will will start with your first zone and begin immediately once you press “Start.”</p>
        <p>Press “Next” to move on to the next step or zone.</p>
        <p>Press “Skip” to skip one or more zones while the current zone is in progress.</p>
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
        <Table>
          <TableHead>
            <TableRow>
              <th className={isRecovering ? '' : 'active'}>Blow out</th>
              <th className={isRecovering ? 'active' : ''}>Recovery</th>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align='center'>{blowOutTime}</TableCell>
              <TableCell align='center'>{recoveryTime}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Button className="trainer-next" onClick={handleNext}>
          Next
        </Button>
      </>
    );
  }

  function renderOnDeck() {
    if (!nextZone) return null;

    return (
      <>
        <h3>Up next</h3>
        <p>{nextZone.name}</p>
        <Button onClick={handleSkip}>Skip</Button>
      </>
    );
  }

  return (
    <>
      <h2>Blow out sequence trainer</h2>
      {!isTraining ? (
        <>
          {renderInstructions()}
          <Button
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={startTraining}
          >
            Start
          </Button>
        </>
      ) : (
        <>
          {renderCurrentStep()}
          {renderOnDeck()}
          <Button
            variant="contained"
            color="primary"
            onClick={completeTraining}
          >
            Complete
          </Button>
        </>
      )}
    </>
  );
};
