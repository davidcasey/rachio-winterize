import { JSX, useState } from 'react';

import { Zone } from 'app/models/devices';
import { Device } from 'app/models/devices';
import { ZoneSettingsRow } from 'app/components/ZoneSettings/ZoneSettingsRow';

export type ZoneSettingsProps = {
  devices: Device[];
}

export const ZoneSettings = ({ devices }: ZoneSettingsProps): JSX.Element => {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(devices.length > 1 ? null : devices[0]);
  const [cycles, setCycles] = useState<number>(1);

  function renderDeviceSelector() {
    return devices.length > 1 && (
      <select
        onChange={(e) => {
          setSelectedDevice(devices[Number(e.target.value)]);
        }}
      >
        {Array.isArray(devices) && devices.map((device, index) => (
          <option key={index} value={device.id}>
            {device.name}
          </option>
        ))}
      </select>
    );
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
  
  function renderZoneRows() {
    if (!selectedDevice) return null;

    return Array(cycles).fill(null).map((_, cycleIndex) => (
      selectedDevice.zones.map((zone: Zone, zoneIndex) => (
        <ZoneSettingsRow zone={zone} key={`${cycleIndex}-${zoneIndex}`} />
      ))
    )).flat();
  }

  function renderZoneSettingsTable() {
    return selectedDevice && (
      <>
        <h2>{selectedDevice.name}</h2>
        {renderCycleSelector()}
        <table>
          <thead>
            <tr>
              <th>Enabled</th>
              <th>Zone Name</th>
              <th>Blow Out Time (seconds)</th>
              <th>Recovery Time (seconds)</th>
            </tr>
          </thead>
          <tbody>
            {renderZoneRows()}
          </tbody>
        </table>
      </>
    );
  }

  return (
    <>
      {renderDeviceSelector()}
      {renderZoneSettingsTable()}
    </>
  );
}
