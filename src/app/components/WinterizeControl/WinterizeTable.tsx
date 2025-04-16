import { JSX, useContext, Fragment } from 'react';
import styled from 'styled-components';

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

const Table = styled.table `
  tr.bg-gray-100 {
    background-color: #333;
  }
  tr.active {
    background-color: #d1f7c4; /* Light green background for active row */
  }
  td:first-child {
    text-align: center;
  }
  tr.active td:first-child:before {
    content: '▶';
  }
`;

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
  } = useBlowout(
    blowOutTime,
    recoveryTime
  );

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
                <tr className="bg-gray-100 text-sm text-gray-600">
                  <td colSpan={100} className="py-2 px-4">
                    Cycle {cycleCount}
                    <span className="space-x-2">
                      <button onClick={() => duplicateCycle(step.cycleId)}>Duplicate below</button>
                      <button onClick={() => deleteCycle(step.cycleId)}>Delete</button>
                    </span>
                  </td>
                </tr>
              )}
              <tr className={isActive ? 'active' : ''}>
                <WinterizeTableRow step={step} />
              </tr>
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
      <tr aria-label="Add a new cycle">
        <td colSpan={3}>
          <button
            type="button"
            onClick={() => {
              addCycle(
                zones,
                blowOutTime,
                recoveryTime
              );
            }}
          >
            Add new cycle
          </button>
        </td>
        <td><BlowOutTime /></td>
        <td><RecoveryTime /></td>
      </tr>
    );
  }

  /**
   * return WinterizeTable JSX
   */
  if (!selectedDevice || !zones) return <></>;
  return  (
    <>
      <h2>{selectedDevice.name}</h2>
      <Table>
        <thead>
          <tr>
            <th colSpan={3}></th>
            <th colSpan={2}>Time (seconds)</th>
          </tr>
          <tr>
            <th>{/* isActive */}</th>
            <th>Enabled</th>
            <th>Zone name</th>
            <th>Blow out</th>
            <th>Recovery</th>
          </tr>
        </thead>
        <tbody>
          {renderWinterizeRows()}
        </tbody>
        <tfoot>
          {renderAddCycleRow(zones)}
          <tr>
            <td colSpan={100}>
              <button type="button" onClick={resetWinterizeSequence} disabled={isBlowoutRunning || winterizeSequence.length === 0}>
                Reset table
              </button>
              <button type="button" onClick={stopBlowout} disabled={!isBlowoutRunning}>
                Cancel
              </button>
              <button type="button" onClick={startBlowout} disabled={isBlowoutRunning}>
                Start blowout
              </button>
            </td>
          </tr>
        </tfoot>
      </Table>
    </>
  );
}
