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
  useMediaQuery,
  useTheme,
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (error) {
    return <p>{error}</p>;
  }

  function handleCompleteTraining() {
    completeTraining?.();
    onClose();
  }

  function renderInstructions() {
    return (
      <Box mb={isMobile ? 2 : 4}>
        <Typography variant="body2" mb={2}>
          Before we start, ensure your air compressor is ready and all hoses are securely connected. 
          The training will start with your first zone immediately once you press "Start."
        </Typography>
        <Box component="ul" sx={{ pl: 3, mb: 2 }}>
          <li>
            <Typography variant="body2">Press "Next" to move on to the next step or zone.</Typography>
          </li>
          <li>
            <Typography variant="body2">Press "Skip" to skip one or more zones.</Typography>
          </li>
          <li>
            <Typography variant="body2">Press "Complete" to finish training.</Typography>
          </li>
        </Box>
        <Typography variant="body2">
          Upon completion, fine-tune any learned values in the table as needed.
        </Typography>
      </Box>
    );
  }

  function renderCurrentStep() {
    if (!currentZone) return null;

    return (
      <>
        <Typography variant="subtitle2" fontWeight="bold" align="left" mb={1}>
          Current zone
        </Typography>
        <Box 
          textAlign="center" 
          mb={isMobile ? 2 : 4} 
          p={isMobile ? 1.5 : 2} 
          border={1} 
          borderColor="grey.300" 
          borderRadius={2}
        >
          <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold" mb={2}>
            {currentZone.name}
          </Typography>
          <Table sx={{ width: isMobile ? '100%' : '66%', margin: '0 auto' }}>
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  size='small'
                  sx={{
                    backgroundColor: !isRecovering ? 'grey.700' : 'transparent',
                    color: !isRecovering ? 'white' : 'inherit',
                    py: 1,
                  }}
                >
                  <Typography variant="body2">Blowout</Typography>
                </TableCell>
                <TableCell
                  align="center"
                  size='small'
                  sx={{
                    backgroundColor: isRecovering ? 'grey.700' : 'transparent',
                    color: isRecovering ? 'white' : 'inherit',
                    py: 1,
                  }}
                >
                  <Typography variant="body2">Recovery</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align="center" sx={{ py: 2 }}>
                  <Typography
                    variant={isMobile ? "h4" : "h5"}
                    fontWeight="bold"
                    color={!isRecovering ? 'text.primary' : 'text.secondary'}
                  >
                    {blowOutTime}
                  </Typography>
                </TableCell>
                <TableCell align="center" sx={{ py: 2 }}>
                  <Typography
                    variant={isMobile ? "h4" : "h5"}
                    fontWeight="bold"
                    color={isRecovering ? 'text.primary' : 'text.secondary'}
                  >
                    {recoveryTime}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              fullWidth={isMobile}
              sx={{ width: isMobile ? '100%' : '66%' }}
              size={isMobile ? 'large' : 'large'}
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
          <Typography variant="subtitle2" fontWeight="bold" align="left" mb={1}>
            Up next
          </Typography>
          <Box 
            textAlign="center" 
            mb={isMobile ? 2 : 4} 
            p={isMobile ? 1.5 : 2} 
            border={1} 
            borderColor="grey.300" 
            borderRadius={2}
          >
            <Typography
              variant="body2"
              textAlign="center"
              color="text.secondary"
              sx={{ py: 1 }}
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
        <Typography variant="subtitle2" fontWeight="bold" align="left" mb={1}>
          Up next
        </Typography>
        <Box 
          textAlign="center" 
          mb={isMobile ? 2 : 4} 
          p={isMobile ? 1.5 : 2} 
          border={1} 
          borderColor="grey.300" 
          borderRadius={2}
        >
          <Box display="flex" justifyContent="center" alignItems="center">
            <Typography
              variant={isMobile ? "body1" : "h6"}
              fontWeight="bold"
              textAlign="center"
              flexGrow={1}
              sx={{ ml: isMobile ? 4 : 9 }}
            >
              {nextZone.name}
            </Typography>

            <Button
              onClick={handleSkip}
              variant="text"
              size={isMobile ? "small" : "medium"}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: 'auto',
                ml: 1,
              }}
            >
              <ChevronRight fontSize={isMobile ? "medium" : "large"} />
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
    <Box sx={{ p: isMobile ? 2 : 4, maxWidth: 600, margin: '0 auto' }}>
      {!isTraining ? (
        <>
          {renderInstructions()}
          <Box display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              onClick={startTraining}
              fullWidth={isMobile}
              size={isMobile ? 'large' : 'medium'}
            >
              Start
            </Button>
          </Box>
        </>
      ) : (
        <>
          {renderCurrentStep()}
          {renderOnDeck()}
          <Box mt={isMobile ? 4 : 8} display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              fullWidth={isMobile}
              sx={{ width: isMobile ? '100%' : '66%' }}
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
