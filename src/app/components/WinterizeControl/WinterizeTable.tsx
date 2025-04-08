import { JSX, useContext } from 'react';

import { Device } from 'app/models/rachioModels';
import { WinterizeStep } from 'app/models/winterizeModels';
import { WinterizeContext } from 'app/context/WinterizeContext';
import { WinterizeStepRow } from 'app/components/WinterizeControl/WinterizeStepRow';
import { DeviceSelector } from 'app/components/WinterizeControl/DeviceSelector';
import { BlowOutTime } from 'app/components/WinterizeControl/BlowOutTime';
import { RecoveryTime } from 'app/components/WinterizeControl/RecoveryTime';
import { useWinterizeActions } from 'app/store/winterizeStore';

export type WinterizeTableProps = {
  devices: Device[];
}

export const WinterizeTable = ({ devices }: WinterizeTableProps): JSX.Element => {
  const { winterizeSequence } = useContext(WinterizeContext);
  // const winterizeSequence = useWinterizeActions();

  function renderWinterizeSequence() {
    return winterizeSequence && (
      <>
        <h2>{winterizeSequence.name}</h2>
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
              winterizeSequence.steps.map((step: WinterizeStep) => (
                <WinterizeStepRow step={step} key={`${step.id}`}
                />
              ))
            }
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3}>
                <button type="button" onClick={() => {}}>Add cycle</button>
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
    );
  }

  return (
    <>
      <DeviceSelector devices={devices} />
      {renderWinterizeSequence()}
      <button type="button" onClick={() => {console.log(winterizeSequence)}}>Winterize Sequence</button>
    </>
  );
}
