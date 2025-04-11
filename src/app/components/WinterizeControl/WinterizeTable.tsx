import { JSX, useContext } from 'react';

import { WinterizeStep } from 'app/models/winterizeModels';
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
          {
            winterizeSequence.map((step: WinterizeStep, index) => (
              <WinterizeTableRow step={step} key={index} />
            ))
          }
        </tbody>
        <tfoot>
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
        </tfoot>
      </table>
    </>
  ) || <></>;
}
