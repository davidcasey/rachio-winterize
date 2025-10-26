import { JSX, useContext } from 'react';
import { TextField, useMediaQuery, useTheme } from '@mui/material';

import { WinterizeSettingsContext } from 'app/context/WinterizeSettingsContext';

export const RecoveryTime = (): JSX.Element => {
  const {winterizeSettings, setWinterizeSettings} = useContext(WinterizeSettingsContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  function handleChange(recoveryTime: number) {
    if (winterizeSettings) {
      setWinterizeSettings({
        ...winterizeSettings,
        recoveryTime,
      });
    }
  }

  return (
    <TextField
      type="number"
      id="default-recovery-time"
      value={winterizeSettings?.recoveryTime}
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
