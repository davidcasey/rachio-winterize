import { JSX, useState } from 'react';

import { Device } from 'app/models/rachioModels';
import { WinterizeSettings, WinterizeSequence } from 'app/models/winterizeModels';
import { WinterizeSettingsContext, winterizeSettingsDefault } from 'app/context/WinterizeSettingsContext';
import { WinterizeContext } from 'app/context/WinterizeContext';
import { WinterizeTable } from 'app/components/WinterizeControl/WinterizeTable';
  
export const WinterizeControl = (): JSX.Element => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [winterizeSettings, setWinterizeSettings] = useState<WinterizeSettings>(winterizeSettingsDefault);
  const [winterizeSequence, setWinterizeSequence] = useState<WinterizeSequence | undefined>(undefined);

  return (
    <WinterizeSettingsContext.Provider value={{ winterizeSettings, setWinterizeSettings }}>
      <WinterizeContext.Provider value={{ winterizeSequence, setWinterizeSequence }}>
        <WinterizeTable devices={devices} />
      </WinterizeContext.Provider>
    </WinterizeSettingsContext.Provider>
  );
}
