import { JSX } from 'react';
import { TableCell, TextField, Checkbox, useMediaQuery, useTheme } from '@mui/material';

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
  isActive: boolean;
}

export const WinterizeTableRow = ({ step, isActive }: WinterizeTableRowProps): JSX.Element => {
  const { updateWinterizeStep } = useWinterizeActions();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  function handleSelectedChange(e: React.ChangeEvent<HTMLInputElement>) {
    updateWinterizeStep(step.id, { selected: e.target.checked });
  };

  function handleBlowOutTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      updateWinterizeStep(step.id, { blowOutTime: value });
    }
  };

  function handleRecoveryTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      updateWinterizeStep(step.id, { recoveryTime: value });
    }
  };

  return (
    <>
      <TableCell align='center' sx={{ px: isMobile ? 0.5 : 2 }}>
        {isActive && '▶'}
      </TableCell>
      <TableCell sx={{ px: isMobile ? 0.5 : 2 }}>
        <Checkbox checked={step.selected} onChange={handleSelectedChange} size={isMobile ? 'small' : 'medium'} />
      </TableCell>
      <TableCell sx={{ px: isMobile ? 1 : 2 }}>
        {step.name}
      </TableCell>
      <TableCell align='center' sx={{ px: isMobile ? 0.5 : 2 }}>
        <TextField
          type="number"
          value={step.blowOutTime}
          onChange={handleBlowOutTimeChange}
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
      </TableCell>
      <TableCell align='center' sx={{ px: isMobile ? 0.5 : 2 }}>
        <TextField
          type="number"
          value={step.recoveryTime}
          onChange={handleRecoveryTimeChange}
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
      </TableCell>
    </>
  );
}
