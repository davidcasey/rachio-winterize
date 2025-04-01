import { JSX, useContext, useEffect, useState } from 'react';

import { Device, Zone } from 'app/models/rachioModels';
import { WinterizeContext } from 'app/context/WinterizeContext';

export type DeviceSelectorProps = {
  devices: Device[];
}

export const DeviceSelector = ({ devices }: DeviceSelectorProps): JSX.Element => {
  const { setWinterizeSequence} = useContext(WinterizeContext);

  const [selectedDevice, setSelectedDevice] = useState<Device | null>(devices.length > 1 ? null : devices[0]);
  // const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [cycles, setCycles] = useState<number>(1);

  useEffect(() => {
    // console.log('Selected Device:', selectedDevice);
    // console.log('Cycles:', cycles);
    if (!selectedDevice) return;
    const winterizeActions = Array(cycles).fill(null).map((_, cycleIndex) => (
      selectedDevice.zones.map((zone: Zone, zoneIndex) => {
        return {
          id: `${cycleIndex}-${zoneIndex}`,
          name: zone.name,
          active: false,
          selected: true,
          blowOutTime: 35,
          recoveryTime: 300,
          zone,
        }
      })
    )).flat();
    const winterizeSequence = {
      id: selectedDevice.id,
      name: selectedDevice.name,
      actions: winterizeActions,
    }
    setWinterizeSequence(winterizeSequence);
    console.log('Winterize Sequence:', winterizeSequence);
  }, [selectedDevice, cycles]);

  function handleSelectedDevice(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedDevice(devices[e.target.selectedIndex - 1]);
  }

  function renderCycleSelector() {
    return (
      <div>
        <label htmlFor="cycles">Cycles </label>
        <select
          id="cycles"
          onChange={(e) => {
            setCycles(Number(e.target.value));
          }}
        >
          {[1, 2, 3, 4, 5].map((cycle) => (
            <option key={cycle} value={cycle}>
              {cycle}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div>
      {/* {devices.length > 1 && ( */}
        <select onChange={(e) => {handleSelectedDevice(e)}}>
          {Array.isArray(devices) && devices.map((device, index) => (
            <option key={index} value={device.id}>
              {device.name}
            </option>
          ))}
        </select>
      {/* )} */}
      {renderCycleSelector()}
    </div>
  );
}
