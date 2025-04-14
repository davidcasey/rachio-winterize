import { JSX, useContext, Fragment } from 'react';

import { Zone } from 'app/models/rachioModels';
import { WinterizeSettingsContext } from 'app/context/WinterizeSettingsContext';
import { useSelectedDevice, useZones, useWinterizeSequence } from 'app/store/winterizeStore';
import { useAddWinterizeCycle } from 'app/hooks/useAddWinterizeCycle';

import { WinterizeTableRow } from 'app/components/WinterizeControl/WinterizeTableRow';
import { BlowOutTime } from 'app/components/WinterizeControl/BlowOutTime';
import { RecoveryTime } from 'app/components/WinterizeControl/RecoveryTime';

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
  function renderWinterizeRows() {
    const seenCycleIds = new Set<string>();
    let cycleCount = 0;

    return winterizeSequence.map((step) => {
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
    });
  }

  /**
   * renderAddCycleRow
   * @returns JSX
   */
  function renderAddCycleRow(zones: Zone[]) {
    return (
      <tr aria-label="Add a new cycle">
        <td colSpan={3}>
          <button
            type="button"
            onClick={() => {
              addWinterizeCycle(zones, winterizeSettings.blowOutTime, winterizeSettings.recoveryTime)
            }}>
              Add cycle
            </button>
        </td>
        <td>
          <BlowOutTime />
        </td>
        <td>
          <RecoveryTime />
        </td>
      </tr>
    );
  }

  /**
   * return WinterizeTable JSX
   */
  return selectedDevice && zones && (
    <>
      <h2>{selectedDevice.name}</h2>
      <table>
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
        </tfoot>
      </table>
    </>
  ) || <></>;
}
