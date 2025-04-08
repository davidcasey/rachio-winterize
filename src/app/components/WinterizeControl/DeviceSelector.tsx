import { JSX, useContext, useEffect, useState } from 'react';

import { Device, Zone } from 'app/models/rachioModels';
import { WinterizeSettingsContext } from 'app/context/WinterizeSettingsContext';
import { WinterizeContext } from 'app/context/WinterizeContext';
import { CycleSelector } from 'app/components/WinterizeControl/CycleSelector';

export type DeviceSelectorProps = {
  devices: Device[];
}

export const DeviceSelector = ({ devices }: DeviceSelectorProps): JSX.Element => {
  const {setWinterizeSequence} = useContext(WinterizeContext);
  const {winterizeSettings} = useContext(WinterizeSettingsContext);

  const [selectedDevice, setSelectedDevice] = useState<Device | null>(devices.length > 1 ? null : devices[0]);
  // const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [cycles, setCycles] = useState<number>(0);

  useEffect(() => {
    // console.log('Selected Device:', selectedDevice);
    // console.log('Cycles:', cycles);
    if (!selectedDevice) return;
    const winterizeSteps = Array(cycles).fill(null).map((_, cycleIndex) => (
      selectedDevice.zones.map((zone: Zone, zoneIndex) => {
        return {
          id: `${cycleIndex}-${zoneIndex}`,
          name: zone.name,
          active: false,
          selected: true,
          blowOutTime: winterizeSettings.blowOutTime,
          recoveryTime: winterizeSettings.recoveryTime,
          zone,
        }
      })
    )).flat();
    const winterizeSequence = {
      id: selectedDevice.id,
      name: selectedDevice.name,
      steps: winterizeSteps,
    }
    setWinterizeSequence(winterizeSequence);
    console.log('Winterize Sequence:', winterizeSequence);
  }, [selectedDevice, cycles]);

  function handleSelectedDevice(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedDevice(devices[e.target.selectedIndex - 1]);
  }

  return (
    <>
      {/* {devices.length > 1 && ( */}
        <select onChange={(e) => {handleSelectedDevice(e)}}>
          {Array.isArray(devices) && devices.map((device, index) => (
            <option key={index} value={device.id}>
              {device.name}
            </option>
          ))}
        </select>
      {/* )} */}
      {/* TODO: remove cycle selector for a button to add cycle, duplicating previous cycle */}
      <CycleSelector onChange={setCycles} />
    </>
  );
}
