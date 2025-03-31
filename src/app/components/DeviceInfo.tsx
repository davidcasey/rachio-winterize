import { JSX } from 'react';
import { Device } from 'app/models/devices';

export type DeviceInfoProps = {
  devices: Device[];
}

export const DeviceInfo = ({ devices }: { devices: Device[] }): JSX.Element => {

  if (!devices || devices.length === 0) {
    return <div>No devices found</div>;
  }
  return (
    <>
      <h2>Device Info</h2>
      <table>
        <thead>
          <tr>
            <th>Device Name</th>
            <th>Device ID</th>
            <th>Latitude</th>
            <th>Longitude</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(devices) && devices.map((device, index) => (
            <tr key={index}>
              <td>{device.name}</td>
              <td>{device.id}</td>
              <td>{device.latitude}</td>
              <td>{device.longitude}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
