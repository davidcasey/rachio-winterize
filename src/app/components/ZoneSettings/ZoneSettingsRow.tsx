import { JSX, useState } from 'react';
import { Zone } from 'app/models/devices';

/**
 * ZoneSettingsRow component
 * This component allows the user to select how much time will be spent blowing out the zone, and 
 * how much time will be spent allowing the air compressor to recharge.
 * 
 * @returns JSX.Element
 */

export type ZoneSettingsRowProps = {
  zone: Zone;
}

export const ZoneSettingsRow = ({ zone }: ZoneSettingsRowProps): JSX.Element => {
  const [selected, setSelected] = useState(true);
  const [blowOutTime, setBlowOutTime] = useState(35);
  const [recoveryTime, setRecoveryTime] = useState(300);

  const handleBlowOutTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBlowOutTime(Number(e.target.value));
  };

  const handleRecoveryTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecoveryTime(Number(e.target.value));
  };

  return (
    <tr>
      <td>
        <input type='checkbox' checked={selected} onChange={() => setSelected(!selected)} />
      </td>
      <td>
        { zone.name }
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
