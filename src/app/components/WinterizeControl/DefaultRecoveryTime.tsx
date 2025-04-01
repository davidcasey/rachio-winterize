import { JSX, useContext } from 'react';

import { WinterizeDefaultsContext } from 'app/context/WinterizeDefaultsContext';

export const DefaultRecoveryTime = (): JSX.Element => {
  const {winterizeDefaults, setWinterizeDefaults} = useContext(WinterizeDefaultsContext);

  function handleChange(recoveryTime: number) {
    if (winterizeDefaults) {
      setWinterizeDefaults({
        ...winterizeDefaults,
        recoveryTime,
      });
    }
  }

  return (
    <>
      <label htmlFor="default-recovery-time">Recovery time</label>
      <input
        type="number"
        id="default-recovery-time"
        value={winterizeDefaults?.recoveryTime}
        onChange={(e) => {
          handleChange(Number(e.target.value));
        }}
      />
    </>
  );
}
