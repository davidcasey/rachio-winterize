import { JSX, useState } from 'react';

import { Device } from 'app/models/rachioModels';
import { WinterizeSettings, WinterizeSequence } from 'app/models/winterizeModels';
import { WinterizeSettingsContext, winterizeSettingsDefault } from 'app/context/WinterizeSettingsContext';
import { WinterizeContext } from 'app/context/WinterizeContext';
import { useIsAuth } from 'app/hooks/useAuth';
import { TokenInputForm } from 'app/components/WinterizeControl/TokenInputForm';
import { WinterizeTable } from 'app/components/WinterizeControl/WinterizeTable';
  
export const WinterizeControl = (): JSX.Element => {
  const isAuthenticated = useIsAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [winterizeSettings, setWinterizeSettings] = useState<WinterizeSettings>(winterizeSettingsDefault);
  const [winterizeSequence, setWinterizeSequence] = useState<WinterizeSequence | undefined>(undefined);

  return (
    <WinterizeSettingsContext.Provider value={{ winterizeSettings, setWinterizeSettings }}>
      <WinterizeContext.Provider value={{ winterizeSequence, setWinterizeSequence }}>
        {
          isAuthenticated ? 
            <WinterizeTable devices={devices} /> : 
            <TokenInputForm />
        }
      </WinterizeContext.Provider>
    </WinterizeSettingsContext.Provider>
  );
}
