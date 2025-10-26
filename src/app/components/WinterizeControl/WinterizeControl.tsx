import { JSX, useEffect, useCallback, useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  useMediaQuery,
  useTheme,
  Box,
  IconButton,
  Typography,
  Link,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import GitHubIcon from '@mui/icons-material/GitHub';

import { Device } from 'app/models/rachioModels';
import { WinterizeSettings } from 'app/models/winterizeModels';
import { WinterizeSettingsContext, winterizeSettingsDefault } from 'app/context/WinterizeSettingsContext';
import { 
  useDevices, 
  useSelectedDevice, 
  useWinterizeActions 
} from 'app/store/winterizeStore';

import { DeviceSelector } from 'app/components/WinterizeControl/DeviceSelector';
import { SequenceTrainer } from 'app/components/WinterizeControl/SequenceTrainer';
import { WinterizeTable } from 'app/components/WinterizeControl/WinterizeTable';
import { ExportButton } from 'app/components/ExportButton';
  
export const WinterizeControl = (): JSX.Element => {
  const [winterizeSettings, setWinterizeSettings] = useState<WinterizeSettings>(winterizeSettingsDefault);
  const [showSequenceTrainer, setShowSequenceTrainer] = useState<boolean>(false);
  const devices = useDevices();
  const selectedDevice = useSelectedDevice();
  const { setSelectedDevice } = useWinterizeActions();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const setDevice = useCallback((device: Device) => {
    setSelectedDevice(device);
  }, [setSelectedDevice]);

  // Calling setDevice(devices[0]) directly during render is a bad idea in React – it can cause a 
  // render loop because state is updating during rendering. useEffect to be safe.
  useEffect(() => {
    if (devices?.length === 1) {
      setDevice(devices[0]);
    }
  }, [devices, setDevice]);

  const handleCloseTrainer = () => {
    setShowSequenceTrainer(false);
  };

  return (
    <WinterizeSettingsContext.Provider value={{winterizeSettings, setWinterizeSettings}}>
      {devices && devices.length > 1 && (
        <DeviceSelector devices={devices} onChange={setDevice} />
      )}
      {!showSequenceTrainer && (
        <Button
          variant="contained"
          color="primary"
          type="button"
          sx={{ float: 'right', mb: 2 }}
          onClick={() => setShowSequenceTrainer(true)}
          size={isMobile ? 'small' : 'medium'}
        >
          Training mode
        </Button>
      )}
      
      {isMobile ? (
        // Full-screen overlay for mobile
        <Dialog
          open={showSequenceTrainer}
          onClose={handleCloseTrainer}
          fullScreen
          sx={{
            '& .MuiDialog-paper': {
              margin: 0,
              maxHeight: '100%',
              borderRadius: 0,
            }
          }}
        >
          <Box
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 1,
              backgroundColor: 'background.paper',
              borderBottom: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2,
              py: 1.5,
            }}
          >
            <Box sx={{ fontSize: '1.125rem', fontWeight: 600 }}>
              Training Mode
            </Box>
            <IconButton onClick={handleCloseTrainer} edge="end">
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ overflowY: 'auto', flex: 1 }}>
            <SequenceTrainer onClose={handleCloseTrainer} />
          </Box>
        </Dialog>
      ) : (
        // Regular dialog for desktop
        <Dialog
          open={showSequenceTrainer}
          onClose={handleCloseTrainer}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Blowout sequence trainer</DialogTitle>
          <DialogContent>
            <SequenceTrainer onClose={handleCloseTrainer} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseTrainer} color="primary">
              Quit
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {selectedDevice && <WinterizeTable />}
      <ExportButton />
      <Box
        component="footer"
        sx={{
          py: 2,
          px: 2,
          textAlign: 'center',
          mt: 'auto',
          color: 'text.secondary',
        }}
      >
        <Link
          href="https://github.com/davidcasey"
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          color="inherit"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',   // centers vertically
            gap: 0.5,
            position: 'relative',
            top: 1,                 // 👈 subtle baseline tweak
          }}
        >
          Built by
          <GitHubIcon
            fontSize="small"
            sx={{
              verticalAlign: 'middle',
              position: 'relative',
              top: -0.5,            // 👈 visually centers icon to text baseline
            }}
          />
          David Casey
        </Link>
      </Box>
    </WinterizeSettingsContext.Provider>
  );
}
