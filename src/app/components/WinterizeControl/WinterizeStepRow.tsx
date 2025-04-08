import { JSX, useEffect, useState, useContext } from 'react';

import { WinterizeStep } from 'app/models/winterizeModels';
import { WinterizeContext } from 'app/context/WinterizeContext';

/**
 * WinterizeStepRow component
 * This component allows the user to select how much time will be spent on the following:
 * - selected: if it is selected for the winterize sequence
 * - blowOutTime: how long to blow out the sprinkler zone with air
 * - recoveryTime: how long the air compressor will take to recover
 * 
 * @returns JSX.Element
 */

export type WinterizeStepRowProps = {
  Step: WinterizeStep;
}

export const WinterizeStepRow = ({ Step }: WinterizeStepRowProps): JSX.Element => {
  const {winterizeSequence, setWinterizeSequence} = useContext(WinterizeContext);
  const [selected, setSelected] = useState(Step.selected);
  const [blowOutTime, setBlowOutTime] = useState(Step.blowOutTime);
  const [recoveryTime, setRecoveryTime] = useState(Step.recoveryTime);

  useEffect(() => {
    handleStepChange({
      ...Step,
      selected,
      blowOutTime,
      recoveryTime,
    });
  }, [selected, blowOutTime, recoveryTime]);

  function handleStepChange(Step: WinterizeStep) {
    if (!winterizeSequence) return;
    const updatedSteps = winterizeSequence.steps.map((a) => {
      return a.id === Step.id ? Step : a;
    });
    setWinterizeSequence({
      ...winterizeSequence,
      steps: updatedSteps,
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
        {Step.name}
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
