import { JSX, useContext } from 'react';
import { TextField, useMediaQuery, useTheme } from '@mui/material';

import { WinterizeSettingsContext } from 'app/context/WinterizeSettingsContext';

export const BlowOutTime = (): JSX.Element => {
  const {winterizeSettings, setWinterizeSettings} = useContext(WinterizeSettingsContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  function handleChange(blowOutTime: number) {
    if (winterizeSettings) {
      setWinterizeSettings({
        ...winterizeSettings,
        blowOutTime,
      });
    }
  }

  return (
    <TextField
      type="number"
      id="default-blow-out-time"
      value={winterizeSettings?.blowOutTime}
      onChange={(e) => {
        handleChange(Number(e.target.value));
      }}
      size='small'
      slotProps={{
        htmlInput: {
          min: 0,
          style: { 
            textAlign: 'center',
            padding: isMobile ? '4px' : undefined,
            fontSize: isMobile ? '0.875rem' : undefined
          }
        }
      }}
      sx={{ width: isMobile ? 60 : 80 }}
    />
  );
}