import { JSX } from 'react';

import { WinterizeStep } from 'app/models/winterizeModels';
import { useWinterizeActions } from 'app/store/winterizeStore';

/**
 * WinterizeTableRow component
 * This component allows the user to select how much time will be spent on the following:
 * - selected: if it is selected for the winterize sequence
 * - blowOutTime: how long to blow out the sprinkler zone with air
 * - recoveryTime: how long the air compressor will take to recover
 * 
 * @returns JSX.Element
 */

export type WinterizeTableRowProps = {
  step: WinterizeStep;
}

export const WinterizeTableRow = ({ step }: WinterizeTableRowProps): JSX.Element => {
  const { updateWinterizeStep } = useWinterizeActions();

  function handleSelectedChange(e: React.ChangeEvent<HTMLInputElement>) {
    updateWinterizeStep(step.id, { selected: e.target.checked });
  };

  function handleBlowOutTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
    updateWinterizeStep(step.id, { blowOutTime: parseInt(e.target.value, 10) });
  };

  function handleRecoveryTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
    updateWinterizeStep(step.id, { recoveryTime: parseInt(e.target.value, 10) });
  };

  return (
    <>
      <td>
        {/* { isActive } */}
      </td>
      <td>
        <input type='checkbox' checked={step.selected} onChange={handleSelectedChange} />
      </td>
      <td>
        {step.name}
      </td>
      <td>
        <input type="number" value={step.blowOutTime} onChange={handleBlowOutTimeChange} />
      </td>
      <td>
        <input type="number" value={step.recoveryTime} onChange={handleRecoveryTimeChange} />
      </td>
    </>
  );
} 
