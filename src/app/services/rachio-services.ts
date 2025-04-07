import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Entity, DeviceInfo } from 'app/models/rachioModels';

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const API_BASE_URL = process.env.NEXT_PUBLIC_RACHIO_API_BASE_URL;

if (!API_KEY || !API_BASE_URL) {
  throw new Error('API_KEY or API_BASE_URL is not defined in environment variables.');
}

/**
 * Fetch the person entity currently logged in through OAuth.
 */
export const fetchPersonEntity = async (): Promise<Entity> => {
  const response = await fetch(`${API_BASE_URL}/person/info`, {
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
 * Fetch the device information for a person entity.
 */
export const fetchDeviceInfo = async (entityId: string): Promise<DeviceInfo> => {
  const response = await fetch(`${API_BASE_URL}/person/${entityId}`, {
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

  return response.json();
};

/**
 * Stop all watering on a device.
 */
export const stopWatering = async (deviceId: string): Promise<void> => {
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
export const startZone = async (zoneId: string, duration: number): Promise<void> => {
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
export const usePersonEntity = () => {
  return useQuery<Entity, Error>({
    queryKey: ['personEntity'],
    queryFn: fetchPersonEntity,
    retry: 2,
    staleTime: 1000 * 60 * 5, // Consider data stale after 5 minutes
  });
};

export const useDeviceInfo = (entityId: string) => {
  return useQuery<DeviceInfo, Error>({
    queryKey: ['deviceInfo', entityId],
    queryFn: () => fetchDeviceInfo(entityId),
    enabled: Boolean(entityId), // More explicit than !!entityId
    retry: 2, // Retry failed requests twice
    staleTime: 1000 * 60 * 5, // Consider data stale after 5 minutes
  });
};

export const useStopWatering = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (deviceId) => {
      await stopWatering(deviceId);
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

export const useStartZone = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { zoneId: string; duration: number }>({
    mutationFn: async ({ zoneId, duration }) => {
      await startZone(zoneId, duration);
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
