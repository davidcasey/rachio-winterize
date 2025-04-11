import { JSX, useEffect, useState } from 'react';

import { Device } from 'app/models/rachioModels';
import { WinterizeSettings } from 'app/models/winterizeModels';
import { WinterizeSettingsContext, winterizeSettingsDefault } from 'app/context/WinterizeSettingsContext';
import { 
  useDevices, 
  useSelectedDevice, 
  useZones, 
  useWinterizeActions 
} from 'app/store/winterizeStore';

import { DeviceSelector } from 'app/components/WinterizeControl/DeviceSelector';
import { WinterizeTable } from 'app/components/WinterizeControl/WinterizeTable';
  
export const WinterizeControl = (): JSX.Element => {
  const [winterizeSettings, setWinterizeSettings] = useState<WinterizeSettings>(winterizeSettingsDefault);
  const devices = useDevices();
  const selectedDevice = useSelectedDevice();
  const zones = useZones();
  const { setSelectedDevice } = useWinterizeActions();

  useEffect(() => {
    console.log('selected device: ', selectedDevice);
    console.log('zones: ', zones);
  }, [selectedDevice]);

  function setDevice(device: Device): void {
    setSelectedDevice(device);
  }

  return (
    <WinterizeSettingsContext.Provider value={{ winterizeSettings, setWinterizeSettings }}>
      {/* {devices.length > 1 && ( */}
        { devices && <DeviceSelector devices={devices} onChange={setDevice} /> }
      {/* )} */}
      { selectedDevice && <WinterizeTable /> }
    </WinterizeSettingsContext.Provider>
  );
}
