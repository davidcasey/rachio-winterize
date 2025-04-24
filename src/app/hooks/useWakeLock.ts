'use client';

import { useEffect, useState } from 'react';

export function useWakeLock() {
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);

  useEffect(() => {
    let lock: WakeLockSentinel | null = null;

    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          lock = await navigator.wakeLock.request('screen');
          setWakeLock(lock);

          lock.addEventListener('release', () => {
            setWakeLock(null);
          });
        }
      } catch (err) {
        throw new Error(`Failed to acquire wake lock: ${err}`);
      }
    };
    requestWakeLock();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !wakeLock) {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (lock) {
        lock.release();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return wakeLock;
}
