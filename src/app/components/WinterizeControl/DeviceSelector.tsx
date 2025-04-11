import { JSX } from 'react';
import { Device } from 'app/models/rachioModels';

export type DeviceSelectorProps = {
  devices: Device[];
  onChange: (device: Device) => void;
}

export const DeviceSelector = ({ devices, onChange }: DeviceSelectorProps): JSX.Element => {

  function handleSelectedDevice(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedId = e.target.value;
    const selectedDevice = devices.find(device => device.id === selectedId);
    if (selectedDevice) {
      onChange(selectedDevice);
    }
  }

  return (
    <select onChange={handleSelectedDevice} defaultValue="">
        <option value="" disabled>
          Select device
        </option>
      {devices.map((device) => (
        <option key={device.id} value={device.id}>
          {device.name}
        </option>
      ))}
    </select>
  );
}
