import { WinterizeStep } from 'app/models/winterizeModels';

export interface ExportedState {
  apiToken: string;
  deviceId: string;
  winterizeSequence: WinterizeStep[];
}

/**
 * Encode state to URL hash
 */
export function encodeStateToHash(state: ExportedState): string {
  try {
    const json = JSON.stringify(state);
    const base64 = btoa(json);
    return `#state=${encodeURIComponent(base64)}`;
  } catch (error) {
    console.error('Failed to encode state:', error);
    return '';
  }
}

/**
 * Decode state from URL hash
 */
export function decodeStateFromHash(hash: string): ExportedState | null {
  try {
    // Remove leading # if present
    const cleanHash = hash.startsWith('#') ? hash.slice(1) : hash;
    
    // Parse query params
    const params = new URLSearchParams(cleanHash);
    const stateParam = params.get('state');
    
    if (!stateParam) return null;
    
    const json = atob(decodeURIComponent(stateParam));
    const state = JSON.parse(json) as ExportedState;
    
    // Validate required fields
    if (!state.apiToken || !state.deviceId || !state.winterizeSequence) {
      console.warn('Invalid state structure in URL');
      return null;
    }
    
    return state;
  } catch (error) {
    console.error('Failed to decode state from hash:', error);
    return null;
  }
}

/**
 * Generate shareable URL with current state
 */
export function generateShareableUrl(state: ExportedState): string {
  const hash = encodeStateToHash(state);
  return `${window.location.origin}${window.location.pathname}${hash}`;
}
