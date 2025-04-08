import { createContext, Dispatch, SetStateStep } from 'react';

import { WinterizeSequence } from 'app/models/winterizeModels';

export type WinterizeContextType = {
  winterizeSequence: WinterizeSequence | undefined;
  setWinterizeSequence: Dispatch<SetStateStep<WinterizeSequence | undefined>>;
}

export const WinterizeContext = createContext<WinterizeContextType>({
  winterizeSequence: undefined,
  setWinterizeSequence: () => {},
});

// export const WinterizeContext = createContext<WinterizeSequence | undefined>(undefined);
// export const useWinterizeContext = (): WinterizeSequence => {
//   const winterizeContext = useContext(WinterizeContext);

//   if (winterizeContext === undefined) {
//     throw new Error('useWinterizeContext must be used within a WinterizeProvider');
//   }

//   return winterizeContext;
// }
