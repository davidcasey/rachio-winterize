import { JSX, useEffect, useState } from 'react';
import { Device } from 'app/models/rachioModels';

export type DeviceSelectorProps = {
  devices: Device[];
  onChange: (device: Device) => void;
}

export const DeviceSelector = ({ devices, onChange }: DeviceSelectorProps): JSX.Element => {
  // const {setWinterizeSequence} = useContext(WinterizeContext);
  // const {winterizeSettings} = useContext(WinterizeSettingsContext);

  // const [selectedDevice, setSelectedDevice] = useState<Device | null>(devices.length > 1 ? null : devices[0]);
  // const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  // const [cycles, setCycles] = useState<number>(0);
/*
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
  }, [selectedDevice, cycles]);
  */

  function handleSelectedDevice(e: React.ChangeEvent<HTMLSelectElement>) {
    console.log('Selected Device:', e.target, devices[e.target.selectedIndex - 1]);
    onChange(devices[e.target.selectedIndex - 1]);
  }

  return (
    <select onChange={(e) => {handleSelectedDevice(e)}}>
      {devices.map((device, index) => (
        <option key={index} value={device.id}>
          {device.name}
        </option>
      ))}
    </select>
  );
}
