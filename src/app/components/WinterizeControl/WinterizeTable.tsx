import { JSX } from 'react';

// import { Device } from 'app/models/rachioModels';
// import { WinterizeStep } from 'app/models/winterizeModels';
import { useSelectedDevice } from 'app/store/winterizeStore';

// import { WinterizeStepRow } from 'app/components/WinterizeControl/WinterizeStepRow';
import { BlowOutTime } from 'app/components/WinterizeControl/BlowOutTime';
import { RecoveryTime } from 'app/components/WinterizeControl/RecoveryTime';

export const WinterizeTable = (): JSX.Element => {
  const selectedDevice = useSelectedDevice();

  function renderWinterizeSequence() {
    return selectedDevice && (
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
              // winterizeSequence.steps.map((step: WinterizeStep) => (
              //   <WinterizeStepRow step={step} key={`${step.id}`}
              //   />
              // ))
            }
          </tbody>
          <tfoot>
            <tr aria-label="Add a new cycle">
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
      {renderWinterizeSequence()}
      {/* <button type="button" onClick={() => {console.log(winterizeSequence)}}>Winterize Sequence</button> */}
    </>
  );
}
