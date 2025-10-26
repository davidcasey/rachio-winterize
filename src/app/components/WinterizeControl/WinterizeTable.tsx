import { JSX, useContext, Fragment } from 'react';
import styled from 'styled-components';
import {
  Box,
  Button,
  Table,
  TableHead,
  TableBody,
  TableFooter,
  TableRow,
  TableCell,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { Zone } from 'app/models/rachioModels';
import { WinterizeSettingsContext } from 'app/context/WinterizeSettingsContext';
import { useSelectedDevice, useZones, useWinterizeSequence, useWinterizeActions } from 'app/store/winterizeStore';
import { useAddCycle } from 'app/hooks/useAddCycle';
import { useAddDuplicateCycle } from 'app/hooks/useAddDuplicateCycle';
import { useDeleteCycle } from 'app/hooks/useDeleteCycle';
import { useBlowout } from 'app/hooks/useBlowout';

import { WinterizeTableRow } from 'app/components/WinterizeControl/WinterizeTableRow';
import { BlowOutTime } from 'app/components/WinterizeControl/BlowOutTime';
import { RecoveryTime } from 'app/components/WinterizeControl/RecoveryTime';

const StyledTableRow = styled(TableRow)(() => ({
  '&.active': {
    backgroundColor: '#d1f7c4',
  },
}));

export const WinterizeTable = (): JSX.Element => {
  const { blowOutTime, recoveryTime } = useContext(WinterizeSettingsContext).winterizeSettings;
  const selectedDevice = useSelectedDevice();
  const zones = useZones();
  const winterizeSequence = useWinterizeSequence();
  const { resetWinterizeSequence } = useWinterizeActions();
  const addCycle = useAddCycle();
  const duplicateCycle = useAddDuplicateCycle();
  const deleteCycle = useDeleteCycle();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    isBlowoutRunning,
    activeStep,
    startBlowout,
    stopBlowout
  } = useBlowout();

  /**
   * renderWinterizeRows
   * @returns JSX
   */
  function renderWinterizeRows(): JSX.Element {
    const seenCycleIds = new Set<string>();
    let cycleCount = 0;

    return (
      <>
        {winterizeSequence.map((step) => {
          const isActive = activeStep?.id === step.id;
          const isNewCycle = !seenCycleIds.has(step.cycleId);

          if (isNewCycle) {
            seenCycleIds.add(step.cycleId);
            cycleCount += 1;
          }

          return (
            <Fragment key={step.id}>
              {isNewCycle && (
                <TableRow
                  sx={{
                    backgroundColor: '#f5f5f5',
                    borderTop: '2px solid #ddd',
                    borderBottom: '2px solid #ddd',
                  }}
                >
                  <TableCell />
                  <TableCell colSpan={100} sx={{ py: 1, px: isMobile ? 1 : 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                      <strong>Cycle {cycleCount}</strong>
                      <Box display="flex" gap={1}>
                        <Button
                          onClick={() => duplicateCycle(step.cycleId)}
                          size={isMobile ? 'small' : 'medium'}
                        >
                          Duplicate
                        </Button>
                        <Button
                          onClick={() => deleteCycle(step.cycleId)}
                          size={isMobile ? 'small' : 'medium'}
                        >
                          Delete
                        </Button>
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
              <StyledTableRow className={isActive ? 'active' : ''}>
                <WinterizeTableRow step={step} isActive={isActive} />
              </StyledTableRow>
            </Fragment>
          );
        })}
      </>
    );
  }

  /**
   * renderAddCycleRow
   * @returns JSX
   */
  function renderAddCycleRow(zones: Zone[]): JSX.Element {
    return (
      <TableRow
        aria-label="Add a new cycle"
        sx={{
          backgroundColor: '#f5f5f5',
          borderTop: '2px solid #ddd',
          borderBottom: '2px solid #ddd',
        }}
      >
        <TableCell colSpan={3}>
          <Button
            type="button"
            onClick={() => {
              addCycle(
                zones,
                blowOutTime,
                recoveryTime
              );
            }}
            sx={{ float: 'right' }}
            size={isMobile ? 'small' : 'medium'}
          >
            Add cycle
          </Button>
        </TableCell>
        <TableCell align='center' sx={{ px: isMobile ? 0.5 : 2 }}>
          <BlowOutTime />
        </TableCell>
        <TableCell align='center' sx={{ px: isMobile ? 0.5 : 2 }}>
          <RecoveryTime />
        </TableCell>
      </TableRow>
    );
  }

  /**
   * return WinterizeTable JSX
   */
  if (!selectedDevice || !zones) return <></>;
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', width: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Device: {selectedDevice.name}</Typography>
      <Box sx={{ overflowX: 'auto' }}>
        <Table
          size='small'
          sx={{
            border: '1px solid #ddd',
            borderRadius: '3px',
            mb: 5,
            minWidth: isMobile ? 320 : 'auto',
            width: '100%',
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell colSpan={3} sx={{ px: isMobile ? 0.5 : 2 }} />
              <TableCell colSpan={2} align='center' sx={{ px: isMobile ? 0.5 : 2 }}>
                Time (seconds)
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ width: '5%', px: isMobile ? 0.5 : 2 }}>{/* isActive */}</TableCell>
              <TableCell sx={{ width: '5%', px: isMobile ? 0.5 : 2 }} align='center'>
                ✓
              </TableCell>
              <TableCell sx={{ width: '50%', px: isMobile ? 1 : 2 }}>Zone</TableCell>
              <TableCell sx={{ width: '20%', px: isMobile ? 0.5 : 2 }} align='center'>
                Run
              </TableCell>
              <TableCell sx={{ width: '20%', px: isMobile ? 0.5 : 2 }} align='center'>
                Rest
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renderWinterizeRows()}
          </TableBody>
          <TableFooter>
            {renderAddCycleRow(zones)}
            <TableRow>
              <TableCell colSpan={100} sx={{ px: isMobile ? 1 : 2 }}>
                {winterizeSequence.length === 0 ? (
                  <p style={{ textAlign: 'center' }}>Add at least one cycle to begin blowout</p>
                ) : (
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={2}
                  >
                    <Button
                      onClick={resetWinterizeSequence}
                      disabled={isBlowoutRunning || winterizeSequence.length === 0}
                      size={isMobile ? 'small' : 'medium'}
                    >
                      Reset
                    </Button>
                    <Box display="flex" gap={1}>
                      <Button
                        variant="contained"
                        onClick={stopBlowout}
                        disabled={!isBlowoutRunning}
                        size={isMobile ? 'small' : 'medium'}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={startBlowout}
                        disabled={isBlowoutRunning || winterizeSequence.length === 0}
                        size={isMobile ? 'small' : 'medium'}
                      >
                        Start
                      </Button>
                    </Box>
                  </Box>
                )}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Box>
    </Box>
  );
}
