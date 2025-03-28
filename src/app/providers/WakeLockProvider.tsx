'use client';

import { useWakeLock } from "app/hooks/useWakeLock";

export function WakeLockProvider() {
  useWakeLock(); // Calls the wake lock logic
  return null; // No UI needed, just runs the effect
}
