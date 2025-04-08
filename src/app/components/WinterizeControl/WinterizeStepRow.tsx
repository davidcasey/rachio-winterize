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
  step: WinterizeStep;
}

export const WinterizeStepRow = ({ step }: WinterizeStepRowProps): JSX.Element => {
  const {winterizeSequence, setWinterizeSequence} = useContext(WinterizeContext);
  const [selected, setSelected] = useState(step.selected);
  const [blowOutTime, setBlowOutTime] = useState(step.blowOutTime);
  const [recoveryTime, setRecoveryTime] = useState(step.recoveryTime);

  useEffect(() => {
    handleStepChange({
      ...step,
      selected,
      blowOutTime,
      recoveryTime,
    });
  }, [selected, blowOutTime, recoveryTime]);

  function handleStepChange(step: WinterizeStep) {
    if (!winterizeSequence) return;
    const updatedSteps = winterizeSequence.steps.map((s) => {
      return s.id === step.id ? step : s;
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
        {step.name}
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
