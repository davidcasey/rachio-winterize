import { JSX, useContext } from 'react';
import { TextField } from '@mui/material';

import { WinterizeSettingsContext } from 'app/context/WinterizeSettingsContext';

export const BlowOutTime = (): JSX.Element => {
  const {winterizeSettings, setWinterizeSettings} = useContext(WinterizeSettingsContext);

  function handleChange(blowOutTime: number) {
    if (winterizeSettings) {
      setWinterizeSettings({
        ...winterizeSettings,
        blowOutTime,
      });
    }
  }

  return (
    <>
      {/* <label htmlFor="default-blow-out-time">Blow out time</label> */}
      <TextField
        type="number"
        id="default-blow-out-time"
        value={winterizeSettings?.blowOutTime}
        onChange={(e) => {
          handleChange(Number(e.target.value));
        }}
        size='small'
      />
    </>
  );
}
