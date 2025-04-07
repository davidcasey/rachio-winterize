import { JSX, useEffect, useState, useContext } from 'react';

import { WinterizeAction } from 'app/models/winterizeModels';
import { WinterizeContext } from 'app/context/WinterizeContext';

/**
 * WinterizeActionRow component
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

export const WinterizeActionRow = ({ action }: WinterizeActionUIProps): JSX.Element => {
  const {winterizeSequence, setWinterizeSequence} = useContext(WinterizeContext);
  const [selected, setSelected] = useState(action.selected);
  const [blowOutTime, setBlowOutTime] = useState(action.blowOutTime);
  const [recoveryTime, setRecoveryTime] = useState(action.recoveryTime);

  useEffect(() => {
    handleActionChange({
      ...action,
      selected,
      blowOutTime,
      recoveryTime,
    });
  }, [selected, blowOutTime, recoveryTime]);

  function handleActionChange(action: WinterizeAction) {
    if (!winterizeSequence) return;
    const updatedActions = winterizeSequence.actions.map((a) => {
      return a.id === action.id ? action : a;
    });
    setWinterizeSequence({
      ...winterizeSequence,
      actions: updatedActions,
    });
  }

  function handleBlowOutTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setBlowOutTime(Number(e.target.value));
  };

  function handleRecoveryTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
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
        {action.name}
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
