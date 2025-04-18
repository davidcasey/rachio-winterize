import { JSX } from 'react';
import {
  Box,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
} from '@mui/material';
import { ChevronRight } from '@mui/icons-material';
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
    noMoreZones,
    error,
  } = useSequenceTrainer();

  if (error) {
    return <p>{error}</p>;  // Display the error message if there are no zones
  }

  function handleCompleteTraining() {
    completeTraining?.();  // Safely invoke the function if it is defined
    onClose();
  }

  function renderInstructions() {
    return (
      <Box mb={4}>
        <Typography variant="body1" mb={2}>
          Before we start, ensure your air compressor is ready and all hoses are securely connected. The training and blow out will will start with your first zone and begin immediately once you press "Start."
        </Typography>
        <ul>
          <li>Press "Next" to move on to the next step or zone.</li>
          <li>Press "Skip" to skip one or more zones while the current zone is in progress.</li>
          <li>Press "Complete" to finish the training.</li>
        </ul>
        <Typography variant="body1" mt={2}>
          Upon completion, fine-tune any learned values in the table as needed. Edits are saved instantly.
        </Typography>
      </Box>
    )
  }

  function renderCurrentStep() {
    if (!currentZone) return null;

    return (
      <>
        <Typography variant="subtitle1" fontWeight="bold" align="left">Current zone</Typography>
        <Box textAlign="center" mb={4} p={2} border={1} borderColor="grey.300" borderRadius={2}>
          <Typography variant="h4" fontWeight="bold" mb={2}>{currentZone.name}</Typography>
          <Table sx={{ width: '66%' }} align="center">
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  size='small'
                  sx={{
                    backgroundColor: !isRecovering ? 'grey.700' : 'transparent',
                    color: !isRecovering ? 'white' : 'inherit'
                  }}
                >
                  Blow out
                </TableCell>
                <TableCell
                  align="center"
                  size='small'
                  sx={{
                    backgroundColor: isRecovering ? 'grey.700' : 'transparent',
                    color: isRecovering ? 'white' : 'inherit'
                  }}
                >
                  Recovery
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align="center">
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color={!isRecovering ? 'text.primary' : 'text.secondary'}
                  >
                    {blowOutTime}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color={isRecovering ? 'text.primary' : 'text.secondary'}
                  >
                    {recoveryTime}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Box mt={3}>
            <Button
              variant="contained"
              color="primary"
              sx={{ width: '66%' }}
              size='large'
              onClick={handleNext}
            >
              Next
            </Button>
          </Box>
        </Box>
      </>
    );
  }

  function renderOnDeck() {
    if (!currentZone) return null;
    
    if (noMoreZones) {
      return (
        <>
          <Typography variant="subtitle1" fontWeight="bold" align="left">Up next</Typography>
          <Box textAlign="center" mb={4} p={2} border={1} borderColor="grey.300" borderRadius={2}>
            <Typography
              variant="body1"
              textAlign="center"
              color="text.secondary"
              sx={{ py: 2 }}
            >
              No more zones to skip. Press Next or Complete to finish training.
            </Typography>
          </Box>
        </>
      );
    }

    if (!nextZone) return null;

    return (
      <>
        <Typography variant="subtitle1" fontWeight="bold" align="left">Up next</Typography>
        <Box textAlign="center" mb={4} p={2} border={1} borderColor="grey.300" borderRadius={2}>
          <Box display="flex" justifyContent="center" alignItems="center">
            {/* Centered Zone Name */}
            <Typography
              variant="h6"
              fontWeight="bold"
              textAlign="center"
              flexGrow={1}
              sx={{ ml: 9 }} // adjust this to balance arrow button width
            >
              {nextZone.name}
            </Typography>

            {/* Skip Button with Arrow */}
            <Button
              onClick={handleSkip}
              variant="text"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: 'auto',
                ml: 2,
              }}
            >
              <ChevronRight fontSize="large" />
              <Typography variant="caption" color="text.secondary">
                Skip
              </Typography>
            </Button>
          </Box>
        </Box>
      </>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: 600, margin: '0 auto' }}>
      {!isTraining ? (
        <>
          {renderInstructions()}
          <Box display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              onClick={startTraining}
            >
              Start
            </Button>
          </Box>
        </>
      ) : (
        <>
          {renderCurrentStep()}
          {renderOnDeck()}
          <Box mt={8} display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              sx={{ width: '66%' }}
              size='large'
              onClick={handleCompleteTraining}
            >
              Complete
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};
