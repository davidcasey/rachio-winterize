'use client';
import { DEFAULT_BLOW_OUT_TIME, DEFAULT_RECOVERY_TIME } from 'app/constants/winterizeDefaults';
import { useIsAuth } from 'app/hooks/useAuth';
import { LoginForm } from 'app/components/LoginForm';
import { WinterizeControl } from 'app/components/WinterizeControl/WinterizeControl';

export default function Home() {
  const isAuthenticated = useIsAuth();

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
        <li>Default time to blow out each zone: {DEFAULT_BLOW_OUT_TIME} seconds</li>
        <li>Default time for air compressor recovery: {DEFAULT_RECOVERY_TIME} seconds</li>
      </ul>
      <br /><br />
        {
          isAuthenticated ? 
            <WinterizeControl /> :
            <LoginForm />
        }
    </>
  );
}
