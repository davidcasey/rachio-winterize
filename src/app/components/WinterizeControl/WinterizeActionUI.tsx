import { JSX, useState, useContext } from 'react';

import { WinterizeAction } from 'app/models/winterizeModels';
import { WinterizeDefaultsContext } from 'app/context/WinterizeDefaultsContext';

/**
 * WinterizeActionUI component
 * This component allows the user to select how much time will be spent on the following:
 * - selected: if it is selected for the winterize sequence
 * - blowOutTime: how long to blow out the sprinkler zone with air
 * - recoveryTime: how long the air compressor will take to recover
 * 
 * @returns JSX.Element
 */

export type WinterizeActionUIProps = {
  action: WinterizeAction;
}

export const WinterizeActionUI = ({ action }: WinterizeActionUIProps): JSX.Element => {
  const {winterizeDefaults} = useContext(WinterizeDefaultsContext);
  const [selected, setSelected] = useState(action.selected);
  const [blowOutTime, setBlowOutTime] = useState(winterizeDefaults.blowOutTime);
  const [recoveryTime, setRecoveryTime] = useState(winterizeDefaults.recoveryTime);

  const handleBlowOutTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBlowOutTime(Number(e.target.value));
  };

  const handleRecoveryTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecoveryTime(Number(e.target.value));
  };

  return (
    <tr>
      <td>
        {/* { isActive } */}
      </td>
      <td>
        <input type='checkbox' checked={selected} onChange={() => setSelected(!selected)} />
      </td>
      <td>
        { action.name }
      </td>
      <td>
        <input type="number" value={blowOutTime} onChange={handleBlowOutTimeChange} />
      </td>
      <td>
        <input type="number" value={recoveryTime} onChange={handleRecoveryTimeChange} />
      </td>
    </tr>
  );
} 
