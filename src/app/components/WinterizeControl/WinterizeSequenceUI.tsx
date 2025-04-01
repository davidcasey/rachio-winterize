import { JSX, useContext } from 'react';

import { Device } from 'app/models/rachioModels';
import { WinterizeAction } from 'app/models/winterizeModels';
import { WinterizeContext } from 'app/context/WinterizeContext';
import { WinterizeActionUI } from 'app/components/WinterizeControl/WinterizeActionUI';
import { DeviceSelector } from 'app/components/WinterizeControl/DeviceSelector';
import { DefaultBlowOutTime } from 'app/components/WinterizeControl/DefaultBlowOutTime';
import { DefaultRecoveryTime } from 'app/components/WinterizeControl/DefaultRecoveryTime';

export type WinterizeSequenceUIProps = {
  devices: Device[];
}

export const WinterizeSequenceUI = ({ devices }: WinterizeSequenceUIProps): JSX.Element => {
  const { winterizeSequence } = useContext(WinterizeContext);

  function renderWinterizeSequenceTable() {
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
              winterizeSequence.actions.map((action: WinterizeAction) => (
                <WinterizeActionUI action={action} key={`${action.id}`} />
              ))
            }
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3}>
                <button type="button" onClick={() => {}}>Add cycle</button>
              </td>
              <td>
                <DefaultBlowOutTime />
              </td>
              <td>
                <DefaultRecoveryTime />
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
      {renderWinterizeSequenceTable()}
    </>
  );
}
