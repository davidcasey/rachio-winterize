import { JSX, useContext, Fragment } from 'react';
import styled from 'styled-components';

import { Zone } from 'app/models/rachioModels';
import { WinterizeSettingsContext } from 'app/context/WinterizeSettingsContext';
import { useSelectedDevice, useZones, useWinterizeSequence } from 'app/store/winterizeStore';
import { useAddWinterizeCycle } from 'app/hooks/useAddWinterizeCycle';
import { useDuplicatePreviousCycle } from 'app/hooks/useDuplicatePreviousCycle';

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
  const {winterizeSettings} = useContext(WinterizeSettingsContext);
  const selectedDevice = useSelectedDevice();
  const zones = useZones();
  const winterizeSequence = useWinterizeSequence();
  const addWinterizeCycle = useAddWinterizeCycle();

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
                  </td>
                </tr>
              )}
              <WinterizeTableRow step={step} />
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
    const { duplicateLastCycle, hasPreviousCycle } = useDuplicatePreviousCycle();
  
    return (
      <tr aria-label="Add a new cycle">
        <td colSpan={3}>
          <button
            type="button"
            disabled={!hasPreviousCycle}
            onClick={duplicateLastCycle}
          >
            Duplicate previous cycle
          </button>
  
          <button
            type="button"
            onClick={() => {
              addWinterizeCycle(zones, winterizeSettings.blowOutTime, winterizeSettings.recoveryTime);
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
  return selectedDevice && zones && (
    <>
      <h2>{selectedDevice.name}</h2>
      <Table>
        <thead>
          <tr>
            <th>
              {/* isActive */ }
            </th>
            <th>Enabled</th>
            <th>Zone Name</th>
            <th>Blow Out Time (seconds)</th>
            <th>Recovery Time (seconds)</th>
          </tr>
        </thead>
        <tbody>
          {renderWinterizeRows()}
        </tbody>
        <tfoot>
          {renderAddCycleRow(zones)}
          <tr>
            <td colSpan={100}>
              <button>Cancel</button>
              <button>Start blowout</button>
            </td>
          </tr>
        </tfoot>
      </Table>
    </>
  ) || <></>;
}
