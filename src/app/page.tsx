'use client';

import { useState } from 'react';

import { getDeviceInfo, getPersonEntity } from 'app/services/rachio';
import { Device } from 'app/models/devices';
import { ZoneSettingsTable } from 'app/components/ZoneSettings/ZoneSettingsTable';

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

  function DeviceInfoJSX() {
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

  function ZoneSettings() {
    // TODO: Dropdown for multiple devices if deviceActiveZones.length > 1
    // TODO: Add how many times to cycle through the zones
    return (
      <>
        {Array.isArray(deviceActiveZones) && deviceActiveZones.map((device, deviceIndex) => (
          <div key={deviceIndex}>
            <h2>{device.name}</h2>
            <ZoneSettingsTable zones={device.zones} key={deviceIndex} />
          </div>
        ))}
      </>
    );
  }

  return (
    <>
      <h1>Rachio Winterize</h1>
      <p>
        This tool will help you winterize your Rachio system by blowing out the zones with air. 
        It is important to follow the recommendations below to prevent damage to your system.
      </p>
      <ul>
        <li>Air pressure must not exceed 50 pounds per square inch (psi).</li>
        <li>Do not run equipment for longer than 1 minute on air.</li>
        <li>Default time to blow out each zone: 35 seconds</li>
        <li>Default time for air compressor recovery: 300 seconds</li>
      </ul>
      <br /><br />
      
      <label htmlFor="api-key">API Token 
        <small><a href="https://rachio.readme.io/docs/authentication" target="_blank">locate your token</a></small>
      </label>
      <input id="api-key" type="text" placeholder="Enter your API key" />
      <button onClick={initializeData}>
        Fetch
      </button>
      <p>
        <small>Your Rachio API token is never stored on the server and only used for the duration of your session. Accessing the site over a public network is not recommended.</small>
      </p>
      <br /><br />

      <ZoneSettings />
    </>
  );
}
