import { useEffect, useState } from 'react';
import { useSetAuthToken } from 'app/store/authStore';
import { useWinterizeActions, useSelectedDevice, useWinterizeSequence, useWinterizeHydrated } from 'app/store/winterizeStore';
import { decodeStateFromHash, generateShareableUrl, ExportedState } from 'app/utils/urlStateUtils';
import { getAuthToken } from 'app/hooks/useAuth';

/**
 * Hook to manage loading state from URL and generating shareable URLs
 */
export const useUrlState = () => {
  const [isLoadingFromUrl, setIsLoadingFromUrl] = useState(false);
  const [urlLoadError, setUrlLoadError] = useState<string | null>(null);
  const [hasLoadedFromUrl, setHasLoadedFromUrl] = useState(false);
  
  const setAuthToken = useSetAuthToken();
  const { addWinterizeSteps } = useWinterizeActions();
  const selectedDevice = useSelectedDevice();
  const winterizeSequence = useWinterizeSequence();
  const isHydrated = useWinterizeHydrated();

  // Load state from URL hash on mount
  useEffect(() => {
    // Only run once
    if (hasLoadedFromUrl) return;

    const hash = window.location.hash;
    if (!hash || !hash.includes('state=')) return;

    const loadFromUrl = async () => {
      setIsLoadingFromUrl(true);
      setUrlLoadError(null);

      try {
        const state = decodeStateFromHash(hash);
        
        if (!state) {
          setUrlLoadError('Invalid URL format');
          setIsLoadingFromUrl(false);
          return;
        }

        // Set the API token and wait for authentication
        await setAuthToken(state.apiToken);
        
        // Mark that we've loaded to prevent duplicates
        setHasLoadedFromUrl(true);
        
      } catch (error) {
        console.error('Error loading from URL:', error);
        setUrlLoadError('Failed to load saved state from URL. Please check your API token.');
        setIsLoadingFromUrl(false);
      }
    };

    loadFromUrl();
  }, [hasLoadedFromUrl, setAuthToken]);

  // Wait for store to hydrate, then load the winterize sequence
  useEffect(() => {
    if (!hasLoadedFromUrl || !isHydrated) return;
    if (winterizeSequence.length > 0) return; // Already loaded

    const hash = window.location.hash;
    if (!hash || !hash.includes('state=')) return;

    try {
      const state = decodeStateFromHash(hash);
      if (!state) return;

      // Add the winterize steps
      addWinterizeSteps(state.winterizeSequence);
      
      // Clear the hash to avoid reloading on refresh
      window.history.replaceState(null, '', window.location.pathname);
      
      setIsLoadingFromUrl(false);
      
    } catch (error) {
      console.error('Error loading winterize sequence:', error);
      setUrlLoadError('Failed to load saved sequence');
      setIsLoadingFromUrl(false);
    }
  }, [hasLoadedFromUrl, isHydrated, winterizeSequence.length, addWinterizeSteps]);

  /**
   * Generate a shareable URL with current state
   */
  const generateUrl = (): string | null => {
    const apiToken = getAuthToken();
    
    if (!apiToken || !selectedDevice || winterizeSequence.length === 0) {
      return null;
    }

    const state: ExportedState = {
      apiToken,
      deviceId: selectedDevice.id,
      winterizeSequence,
    };

    return generateShareableUrl(state);
  };

  /**
   * Copy shareable URL to clipboard
   */
  const copyUrlToClipboard = async (): Promise<boolean> => {
    const url = generateUrl();
    
    if (!url) return false;

    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  };

  return {
    isLoadingFromUrl,
    urlLoadError,
    generateUrl,
    copyUrlToClipboard,
    canExport: !!(getAuthToken() && selectedDevice && winterizeSequence.length > 0),
  };
};
