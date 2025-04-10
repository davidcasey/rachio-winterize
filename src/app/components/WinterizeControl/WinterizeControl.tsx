import { JSX, useState } from 'react';

import { Device } from 'app/models/rachioModels';
import { WinterizeSettings, WinterizeSequence } from 'app/models/winterizeModels';
import { useDevices, useWinterizeActions } from 'app/store/winterizeStore';

import { WinterizeSettingsContext, winterizeSettingsDefault } from 'app/context/WinterizeSettingsContext';
import { WinterizeContext } from 'app/context/WinterizeContext';

import { DeviceSelector } from 'app/components/WinterizeControl/DeviceSelector';
import { CycleSelector } from 'app/components/WinterizeControl/CycleSelector';
import { WinterizeTable } from 'app/components/WinterizeControl/WinterizeTable';
  
export const WinterizeControl = (): JSX.Element => {
  const devices = useDevices();
  const setSelectedDevice = useWinterizeActions().setSelectedDevice;
  // const [selectedDevice, setSelectedDevice] = useState<Device>(null);
  // const [cycles, setCycles] = useState<number>(0);
  // const [winterizeSettings, setWinterizeSettings] = useState<WinterizeSettings>(winterizeSettingsDefault);
  // const [winterizeSequence, setWinterizeSequence] = useState<WinterizeSequence | undefined>(undefined);
  console.log(devices);

  return (
    <>
    {/* <WinterizeSettingsContext.Provider value={{ winterizeSettings, setWinterizeSettings }}>
      <WinterizeContext.Provider value={{ winterizeSequence, setWinterizeSequence }}> */}
        {/* {devices.length > 1 && ( */}
          { devices && <DeviceSelector devices={devices} onChange={setSelectedDevice} /> }
        {/* )} */}
        {/* { cycles && <CycleSelector cycles={cycles} onChange={setCycles} /> }
        { selectedDevice && <WinterizeTable device={selectedDevice} /> } */}
      {/* </WinterizeContext.Provider>
    </WinterizeSettingsContext.Provider> */}
    </>
  );
}
