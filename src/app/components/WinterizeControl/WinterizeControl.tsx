import { JSX, useEffect, useState } from 'react';

import { Device } from 'app/models/rachioModels';
import { WinterizeSettings } from 'app/models/winterizeModels';
import { WinterizeSettingsContext, winterizeSettingsDefault } from 'app/context/WinterizeSettingsContext';
import { 
  useDevices, 
  useSelectedDevice, 
  useZones, 
  useWinterizeSequence,
  useWinterizeActions 
} from 'app/store/winterizeStore';

import { DeviceSelector } from 'app/components/WinterizeControl/DeviceSelector';
import { WinterizeTable } from 'app/components/WinterizeControl/WinterizeTable';
  
export const WinterizeControl = (): JSX.Element => {
  const [winterizeSettings, setWinterizeSettings] = useState<WinterizeSettings>(winterizeSettingsDefault);
  const devices = useDevices();
  const selectedDevice = useSelectedDevice();
  const { setSelectedDevice } = useWinterizeActions();
  const winterizeSequence = useWinterizeSequence();

  // Calling setDevice(devices[0]) directly during render is a bad idea in React — it can cause a 
  // render loop because state is updating during rendering. useEffect to be safe.
  useEffect(() => {
    if (devices?.length === 1) {
      setDevice(devices[0]);
    }
  }, [devices, setDevice]);

  // TEMPORARY DEBUGGING!
  const zones = useZones();
  useEffect(() => {
    console.log('selected device: ', selectedDevice);
    console.log('zones: ', zones);
  }, [selectedDevice]);
  useEffect(() => {
    console.log('winterize sequence: ', winterizeSequence);
  }, [winterizeSequence]);
  // END DEBUG


  function setDevice(device: Device): void {
    setSelectedDevice(device);
  }

  return (
    <WinterizeSettingsContext.Provider value={{winterizeSettings, setWinterizeSettings}}>
      {devices && devices.length > 1 && (
        <DeviceSelector devices={devices} onChange={setDevice} />
      )}
      { selectedDevice && <WinterizeTable /> }
    </WinterizeSettingsContext.Provider>
  );
}
