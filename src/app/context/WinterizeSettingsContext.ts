import { createContext, Dispatch, SetStateAction } from 'react';

import { WinterizeSettings } from 'app/models/winterizeModels';

export type WinterizeDefaultsContextType = {
  winterizeSettings: WinterizeSettings;
  setWinterizeSettings: Dispatch<SetStateAction<WinterizeSettings>>;
}

export const winterizeSettingsDefault: WinterizeSettings = {
  blowOutTime: 35,
  recoveryTime: 300,
};

export const WinterizeDefaultsContext = createContext<WinterizeDefaultsContextType>({
  winterizeSettings: winterizeSettingsDefault,
  setWinterizeSettings: () => {},
});
