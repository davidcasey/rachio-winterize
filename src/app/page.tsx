'use client';

import { useState } from 'react';

import { getDeviceInfo, getPersonEntity } from 'app/services/Rachio';
import { Zone, Device } from 'app/models/devices';

export default function Home() {
  const [deviceActiveZones, setDeviceActiveZones] = useState<Device[]>([]);

  function initializeData() {
    getPersonEntity().then(entity => {
      getDeviceInfo(entity.id).then(info => {
        let deviceActiveZones = info.devices.map(device => {
          return {
            name: device.name,
            id: device.id,
            latitude: device.latitude,
            longitude: device.longitude,
            zones: device.zones.filter(zone => zone.enabled).sort((a, b) => a.zoneNumber - b.zoneNumber),
          }
        });
        setDeviceActiveZones(deviceActiveZones);
      });
    }
  )}

  function DeviceInfo() {
    return (
      <div>
        <br /><br /><h2>Device Info</h2>
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
            {Array.isArray(deviceActiveZones) && deviceActiveZones.map((device, index) => (
              <tr key={index}>
                <td>{device.name}</td>
                <td>{device.id}</td>
                <td>{device.latitude}</td>
                <td>{device.longitude}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  function ZoneInfo() {
    return (
      <div>
        <br /><br /><h2>Zone Info</h2>
        <table>
          <thead>
            <tr>
              <th>Zone Name</th>
              <th>Zone ID</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(deviceActiveZones) && deviceActiveZones.map((device, deviceIndex) => (
              device.zones.map((zone: Zone, zoneIndex) => (
                <tr key={`${deviceIndex}-${zoneIndex}`}>
                  <td>{zone.name}</td>
                  <td>{zone.id}</td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <>
      <h1>Rachio Winterize</h1>
      <ul>
        <li>Air pressure must not exceed 50 pounds per square inch (psi).</li>
        <li>Do not run equipment for longer than 1 minute on air.</li>
        <li>35 Time to blow out each zone seconds</li>
        <li>300 Time for air compressor recovery seconds</li>
      </ul>
      <button onClick={initializeData}>
        Fetch
      </button>
      <DeviceInfo />
      <ZoneInfo />
    </>
  );
}
