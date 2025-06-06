import { JSX, useContext } from 'react';
import { TextField } from '@mui/material';

import { WinterizeSettingsContext } from 'app/context/WinterizeSettingsContext';

export const RecoveryTime = (): JSX.Element => {
  const {winterizeSettings, setWinterizeSettings} = useContext(WinterizeSettingsContext);

  function handleChange(recoveryTime: number) {
    if (winterizeSettings) {
      setWinterizeSettings({
        ...winterizeSettings,
        recoveryTime,
      });
    }
  }

  return (
    <>
      {/* <label htmlFor="default-recovery-time">Recovery time</label> */}
      <TextField
        type="number"
        id="default-recovery-time"
        value={winterizeSettings?.recoveryTime}
        onChange={(e) => {
          handleChange(Number(e.target.value));
        }}
        size='small'
      />
    </>
  );
}
