import { DeviceInfo } from 'app/models/devices';
import { Entity } from 'app/models/entity';

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const API_BASE_URL = process.env.NEXT_PUBLIC_RACHIO_API_BASE_URL;

/**
 * Retrieve the id for the person entity currently logged in through OAuth.
 * @returns Promise<Entity> The person entity information or an error if the request fails
 * @throws Error if the request fails
 */
const getPersonEntity = async (): Promise<Entity> => {
  const response = await fetch(`${API_BASE_URL}/person/info`,  {
    method: 'GET',
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error getting person entity: ${response.status}`);
  }

  return response.json();
};

/**
 * Retrieve the information for a person entity
 * @param entityId The id of the person entity
 * @returns Promise<DeviceInfo>} The device information or an error if the request fails
 * @throws Error if the request fails
 */
const getDeviceInfo = async (entityId: string): Promise<DeviceInfo> => {
  const response = await fetch(`${API_BASE_URL}/person/${entityId}`,  {
    method: 'GET',
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error getting device info: ${response.status}`);
  }

  return await response.json();
};

/**
 * Stop all watering on device
 * @param deviceId The device's unique id
 */
const deviceStopWater = (deviceId: string): void => {
  fetch(`${API_BASE_URL}/device/stop_water`,  {
    method: 'PUT',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      id: deviceId
    }),
  }).catch((error) => {
    throw new Error(`Error stopping watering: ${error}`);
  });
};

/**
 * Start a zone
 * @param zoneId The zone's unique id
 * @param duration Duration in seconds (Range is 0 - 10800 (3 Hours) )
 */
const zoneStart = (zoneId: string, duration: number): void => {
  fetch(`${API_BASE_URL}/zone/start`,  {
    method: 'PUT',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      id: zoneId,
      duration: duration
    }),
  }).catch((error) => {
    throw new Error(`Error starting watering: ${error}`);
  });
};

export {
  getPersonEntity,
  getDeviceInfo,
  deviceStopWater,
  zoneStart
}
