import { JSX, useEffect, useCallback, useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button
} from '@mui/material';

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
  
export const WinterizeControl = (): JSX.Element => {
  const [winterizeSettings, setWinterizeSettings] = useState<WinterizeSettings>(winterizeSettingsDefault);
  const [showSequenceTrainer, setShowSequenceTrainer] = useState<boolean>(false);
  const devices = useDevices();
  const selectedDevice = useSelectedDevice();
  const { setSelectedDevice } = useWinterizeActions();

  const setDevice = useCallback((device: Device) => {
    setSelectedDevice(device);
  }, [setSelectedDevice]);

  // Calling setDevice(devices[0]) directly during render is a bad idea in React — it can cause a 
  // render loop because state is updating during rendering. useEffect to be safe.
  useEffect(() => {
    if (devices?.length === 1) {
      setDevice(devices[0]);
    }
  }, [devices, setDevice]);

  return (
    <WinterizeSettingsContext.Provider value={{winterizeSettings, setWinterizeSettings}}>
      {devices && devices.length > 1 && (
        <DeviceSelector devices={devices} onChange={setDevice} />
      )}
      { !showSequenceTrainer ? (
        <Button
          variant="contained"
          color="primary"
          type="button"
          sx={{ float: 'right' }}
          onClick={() => setShowSequenceTrainer(!showSequenceTrainer)}
        >
          Training mode
        </Button>
      ) : (<></>)}
      
      <Dialog
        open={showSequenceTrainer}
        onClose={() => {
          setShowSequenceTrainer(false)
        }} // Close modal when clicked outside
        maxWidth="sm"  // Control the max width of the modal
        fullWidth  // Take up full width
      >
        <DialogTitle>Blow out sequence trainer</DialogTitle>
        <DialogContent>
          {/* Your SequenceTrainer Component */}
          <SequenceTrainer onClose={() => setShowSequenceTrainer(false)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSequenceTrainer(false)} color="primary">
            Quit
          </Button>
        </DialogActions>
      </Dialog>

      {/* {showSequenceTrainer && <SequenceTrainer onClose={() => setShowSequenceTrainer(false)}/>} */}
      {selectedDevice && <WinterizeTable />}
    </WinterizeSettingsContext.Provider>
  );
}
