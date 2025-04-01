import { JSX, useContext } from 'react';

import { Device } from 'app/models/rachioModels';
import { WinterizeAction } from 'app/models/winterizeModels';
import { WinterizeContext } from 'app/context/WinterizeContext';
import { WinterizeActionRow } from 'app/components/WinterizeControl/WinterizeActionRow';
import { DeviceSelector } from 'app/components/WinterizeControl/DeviceSelector';
import { BlowOutTime } from 'app/components/WinterizeControl/BlowOutTime';
import { RecoveryTime } from 'app/components/WinterizeControl/RecoveryTime';

export type WinterizeSequenceUIProps = {
  devices: Device[];
}

export const WinterizeTable = ({ devices }: WinterizeSequenceUIProps): JSX.Element => {
  const { winterizeSequence } = useContext(WinterizeContext);

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
              winterizeSequence.actions.map((action: WinterizeAction) => (
                <WinterizeActionRow action={action} key={`${action.id}`}
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
