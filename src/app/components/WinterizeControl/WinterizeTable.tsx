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
                  <TableCell colSpan={100} className="py-2 px-4">
                    <strong>Blow out cycle {cycleCount}</strong>
                    <Button
                      onClick={() => duplicateCycle(step.cycleId)}
                      sx={{ marginLeft: 3 }}
                    >
                      Duplicate cycle
                    </Button>
                    <Button
                      onClick={() => deleteCycle(step.cycleId)}
                      sx={{float: 'right'}}
                    >
                      Delete cycle
                    </Button>
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
          >
            Add new cycle
          </Button>
        </TableCell>
        <TableCell align='center'>
          <BlowOutTime />
        </TableCell>
        <TableCell align='center'>
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
    <>
      <h2>Device: {selectedDevice.name}</h2>
      <Table
        size='small'
        sx={{
          border: '1px solid #ddd',
          borderRadius: '3px',
          mb: 5,
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell colSpan={3} />
            <TableCell colSpan={2} align='center'>Time (seconds)</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{width: '5%'}}>{/* isActive */}</TableCell>
            <TableCell sx={{width: '5%'}}>Enabled</TableCell>
            <TableCell sx={{width: '50%'}}>Zone name</TableCell>
            <TableCell sx={{width: '20%'}} align='center'>Blow out</TableCell>
            <TableCell sx={{width: '20%'}} align='center'>Recovery</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {renderWinterizeRows()}
        </TableBody>
        <TableFooter>
          {renderAddCycleRow(zones)}
          <TableRow>
            <TableCell colSpan={100}>
              {winterizeSequence.length === 0 ? (
                <p style={{ textAlign: 'center' }}>Add at least one cycle to begin blowout</p>
              ) : (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Button
                    onClick={resetWinterizeSequence}
                    disabled={isBlowoutRunning || winterizeSequence.length === 0}
                  >
                    Reset table
                  </Button>
                  <Box display="flex" gap={2}>
                    <Button
                      variant="contained"
                      onClick={stopBlowout}
                      disabled={!isBlowoutRunning}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={startBlowout}
                      disabled={isBlowoutRunning || winterizeSequence.length === 0}
                    >
                      Start blowout
                    </Button>
                  </Box>
                </Box>
              )}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
}
