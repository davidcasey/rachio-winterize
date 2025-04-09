import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Entity } from 'app/models/rachioModels';
import { getAuthToken, getAuthId } from 'app/store/authStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_RACHIO_API_BASE_URL;
if (!API_BASE_URL) {
  throw new Error('API_BASE_URL is not defined in environment variables.');
}

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

  if (!response.ok) {
    throw new Error(`Error getting entity info: ${response.status}`);
  }

  return response.json();
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
/*
export const useEntityId = () => {
  return useQuery<Entity, Error>({
    queryKey: ['entity'],
    queryFn: fetchEntityId,
    retry: 2,
    staleTime: 1000 * 60 * 5, // Consider data stale after 5 minutes
  });
};
*/

export const useEntity = () => {
  const entityId = getAuthId();
  if (!entityId) 
    return undefined;
  return useQuery<Entity, Error>({
    queryKey: ['entityInfo', entityId],
    queryFn: () => fetchEntity(entityId),
    enabled: Boolean(entityId), // More explicit than !!entityId
    retry: 2, // Retry failed requests twice
    staleTime: 1000 * 60 * 5, // Consider data stale after 5 minutes
  });
};

export const useStopWatering = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (deviceId) => {
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
