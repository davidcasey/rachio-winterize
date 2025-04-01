import { JSX, useContext } from 'react';

import { Device } from 'app/models/rachioModels';
import { WinterizeAction } from 'app/models/winterizeModels';
import { WinterizeContext } from 'app/context/WinterizeContext';
import { WinterizeActionUI } from 'app/components/WinterizeControl/WinterizeActionUI';
import { DeviceSelector } from 'app/components/WinterizeControl/DeviceSelector';

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
