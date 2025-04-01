'use client';

import { useState } from 'react';

import { getDeviceInfo, getPersonEntity } from 'app/services/rachio-services';
import { Device } from 'app/models/rachioModels';
import { WinterizeSettings, WinterizeSequence } from 'app/models/winterizeModels';
import { WinterizeSettingsContext, winterizeSettingsDefault } from 'app/context/WinterizeSettingsContext';
import { WinterizeContext } from 'app/context/WinterizeContext';
import { WinterizeTable } from 'app/components/WinterizeControl/WinterizeTable';

export default function Home() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [winterizeSettings, setWinterizeSettings] = useState<WinterizeSettings>(winterizeSettingsDefault);
  const [winterizeSequence, setWinterizeSequence] = useState<WinterizeSequence | undefined>(undefined);

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
        setDevices(deviceActiveZones);
      });
    }
  )}

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
      {/* TODO: set default blowout time and recovery time */}
      
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

      <WinterizeSettingsContext.Provider value={{ winterizeSettings, setWinterizeSettings }}>
        <WinterizeContext.Provider value={{ winterizeSequence, setWinterizeSequence }}>
          {devices.length > 0 && <WinterizeTable devices={devices} />}
        </WinterizeContext.Provider>
      </WinterizeSettingsContext.Provider>
    </>
  );
}
