import { createContext, Dispatch, SetStateAction } from 'react';

import { WinterizeDefaults } from 'app/models/winterizeModels';

export type WinterizeDefaultsContextType = {
  winterizeDefaults: WinterizeDefaults;
  setWinterizeDefaults: Dispatch<SetStateAction<WinterizeDefaults>>;
}

export const winterizeDefaultsValue: WinterizeDefaults = {
  blowOutTime: 35,
  recoveryTime: 300,
};

export const WinterizeDefaultsContext = createContext<WinterizeDefaultsContextType>({
  winterizeDefaults: winterizeDefaultsValue,
  setWinterizeDefaults: () => {},
});
