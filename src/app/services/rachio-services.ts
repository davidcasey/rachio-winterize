import { API_BASE_URL } from 'app/constants/winterizeDefaults';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Entity, Device, Zone } from 'app/models/rachioModels';
import { getAuthToken, getAuthId } from 'app/store/authStore';

const isDev = process.env.NODE_ENV === 'development';

/**
 * Fetch the entity id using the private API key
 */
export const fetchEntityId = async (): Promise<{ id: string }> => {
  const API_KEY = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/person/info`, {
    method: 'GET',
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error getting entity ID: ${response.status}`);
  }

  return response.json();
};

/**
 * Fetch entity using the ID. Response contains the device and zone information.
 */
const fetchEntity = async (entityId: string): Promise<Entity> => {
  const API_KEY = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/person/${entityId}`, {
    method: 'GET',
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  const entity = await response.json();

  const mapZone = (zone: Zone): Zone => ({
    id: zone.id,
    name: zone.name,
    imageUrl: zone.imageUrl,
    enabled: zone.enabled,
    zoneNumber: zone.zoneNumber,
  });

  const mapDevice = (device: Device): Device => ({
    id: device.id,
    name: device.name,
    latitude: device.latitude,
    longitude: device.longitude,
    zones: Array.isArray(device.zones)
      ? device.zones
        .filter((zone: Zone) => zone.enabled)
        .sort((a: Zone, b: Zone) => a.zoneNumber - b.zoneNumber)
        .map(mapZone)
      : [],
  });

  const result: Entity = {
    id: entity.id,
    fullName: entity.fullName,
    devices: Array.isArray(entity.devices) ? entity.devices.map(mapDevice) : [],
  };

  return result;
};

/**
 * Stop all watering on a device.
 */
const stopAllWatering = async (deviceId: string): Promise<void> => {
  const API_KEY = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/device/stop_water`, {
    method: 'PUT',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ id: deviceId }),
  });

  if (!response.ok) {
    throw new Error(`Error stopping watering: ${response.status}`);
  }
};

/**
 * Start a zone for a specific duration.
 */
const startZoneWatering = async (zoneId: string, duration: number): Promise<void> => {
  const API_KEY = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/zone/start`, {
    method: 'PUT',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ id: zoneId, duration }),
  });

  if (!response.ok) {
    throw new Error(`Error starting watering: ${response.status}`);
  }
};

/**
 * React Query hooks for API calls.
 */
export const useEntity = ({ enabled = true } = {}) => {
  const entityId = getAuthId();
  const shouldEnable = Boolean(entityId) && enabled;
  const queryResult = useQuery<Entity, Error>({
    queryKey: ['entity', entityId],
    queryFn: () => (entityId ? fetchEntity(entityId) : Promise.reject('No entity ID')),
    enabled: shouldEnable,
    retry: 2,
  });

  if (!entityId) {
    return { data: null, isLoading: false, error: null };
  }
  return queryResult;
};

export const useStopWatering = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (deviceId) => {
      if (isDev) {
        console.info(`[DEV] stopAllWatering called with ${deviceId}`);
        return new Promise((res) => setTimeout(res, 500));
      }

      await stopAllWatering(deviceId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['deviceInfo'],
      });
    },
    onError: (error: Error) => {
      console.error('Failed to stop watering:', error.message);
      throw error;
    },
    retry: 1, // Only retry once for mutations
  });
};

export const useStartZoneWatering = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { zoneId: string; duration: number }>({
    mutationFn: async ({ zoneId, duration }) => {
      if (isDev) {
        console.info(`[DEV] startZoneWatering called for zone ${zoneId} (${duration} sec)`);
        return new Promise((res) => setTimeout(res, 500));
      }

      await startZoneWatering(zoneId, duration);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deviceInfo'] });
    },
    onError: (error: Error) => {
      console.error('Failed to start zone:', error.message);
      throw error;
    },
  });
};
