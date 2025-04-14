import { createContext, Dispatch, SetStateAction } from 'react';

import { WinterizeSettings } from 'app/models/winterizeModels';
import { DEFAULT_BLOW_OUT_TIME, DEFAULT_RECOVERY_TIME } from 'app/constants/winterizeDefaults';

export type WinterizeSettingsContextType = {
  winterizeSettings: WinterizeSettings;
  setWinterizeSettings: Dispatch<SetStateAction<WinterizeSettings>>;
}

export const winterizeSettingsDefault: WinterizeSettings = {
  blowOutTime: DEFAULT_BLOW_OUT_TIME,
  recoveryTime: DEFAULT_RECOVERY_TIME,
};

export const WinterizeSettingsContext = createContext<WinterizeSettingsContextType>({
  winterizeSettings: winterizeSettingsDefault,
  setWinterizeSettings: () => {},
});
