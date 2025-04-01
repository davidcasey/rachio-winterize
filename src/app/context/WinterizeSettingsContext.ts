import { createContext, Dispatch, SetStateAction } from 'react';

import { WinterizeSettings } from 'app/models/winterizeModels';

export type WinterizeSettingsContextType = {
  winterizeSettings: WinterizeSettings;
  setWinterizeSettings: Dispatch<SetStateAction<WinterizeSettings>>;
}

export const winterizeSettingsDefault: WinterizeSettings = {
  blowOutTime: 35,
  recoveryTime: 300,
  selectedDevice: null,
  activeAction: null,
};

export const WinterizeSettingsContext = createContext<WinterizeSettingsContextType>({
  winterizeSettings: winterizeSettingsDefault,
  setWinterizeSettings: () => {},
});
