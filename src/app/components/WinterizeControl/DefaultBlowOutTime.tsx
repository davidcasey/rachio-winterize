import { JSX, useContext } from 'react';

import { WinterizeDefaultsContext } from 'app/context/WinterizeSettingsContext';

export const DefaultBlowOutTime = (): JSX.Element => {
  const {winterizeDefaults, setWinterizeDefaults} = useContext(WinterizeDefaultsContext);

  function handleChange(blowOutTime: number) {
    if (winterizeDefaults) {
      setWinterizeDefaults({
        ...winterizeDefaults,
        blowOutTime,
      });
    }
  }

  return (
    <>
      <label htmlFor="default-blow-out-time">Blow out time</label>
      <input
        type="number"
        id="default-blow-out-time"
        value={winterizeDefaults?.blowOutTime}
        onChange={(e) => {
          handleChange(Number(e.target.value));
        }}
      />
    </>
  );
}
