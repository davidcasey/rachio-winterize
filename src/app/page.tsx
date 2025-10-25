'use client';
import { useEffect, useCallback, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  Collapse,
  Container,
  CircularProgress,
  Alert
} from '@mui/material';

import { DEFAULT_BLOW_OUT_TIME, DEFAULT_RECOVERY_TIME } from 'app/constants/winterizeDefaults';
import { useIsAuth } from 'app/hooks/useAuth';
import { useUrlState } from 'app/hooks/useUrlState';
import { LoginForm } from 'app/components/LoginForm';
import { WinterizeControl } from 'app/components/WinterizeControl/WinterizeControl';

export default function Home() {
  const isAuthenticated = useIsAuth();
  const { isLoadingFromUrl, urlLoadError } = useUrlState();
  const [activePanel, setActivePanel] = useState<null | 'welcome' | 'instructions'>('welcome');

  const togglePanel = useCallback((panel: typeof activePanel) => {
    setActivePanel(prev => (prev === panel ? null : panel));
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      togglePanel(activePanel);
    }
  }, [isAuthenticated, activePanel, togglePanel]);

  return (
    <Box>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box>
            <Button onClick={() => togglePanel('welcome')}>Welcome</Button>
            {/* <Button onClick={() => togglePanel('instructions')}>Instructions</Button> */}
          </Box>
          <Typography variant="h6" align="center" sx={{ flex: 1 }}>
            Rachio Winterize
          </Typography>
          <Box sx={{ width: 120 }} /> {/* spacer to keep logo centered */}
        </Toolbar>
      </AppBar>

      <Collapse in={activePanel === 'welcome'}>
        <Container sx={{ py: 2 }}>
          <Typography variant="h6">Welcome</Typography>
          <p>
            Use this app to help you winterize your Rachio sprinkler system by blowing out each zone with air. 
            It is important to follow the recommendations below to prevent damage to your system.
          </p>
          <ul>
            <li>Air pressure must not exceed 50 pounds per square inch (psi).</li>
            <li>Do not run equipment for longer than 1 minute on air.</li>
            <li>Default time to blow out each zone: {DEFAULT_BLOW_OUT_TIME} seconds</li>
            <li>Default time for air compressor recovery: {DEFAULT_RECOVERY_TIME} seconds</li>
          </ul>
        <Typography></Typography>
        </Container>
      </Collapse>

      {/* <Collapse in={activePanel === 'instructions'}>
        <Container sx={{ py: 2 }}>
          <Typography variant="h6">Instructions</Typography>
          <Typography>Step-by-step guide goes here.</Typography>
        </Container>
      </Collapse> */}

      <Container sx={{ mt: 4 }}>
        {isLoadingFromUrl ? (
          <Box display="flex" flexDirection="column" alignItems="center" gap={2} py={4}>
            <CircularProgress />
            <Typography>Loading your saved configuration...</Typography>
          </Box>
        ) : urlLoadError ? (
          <Box>
            <Alert severity="error" sx={{ mb: 3 }}>
              {urlLoadError}
            </Alert>
            <LoginForm />
          </Box>
        ) : !isAuthenticated ? (
          <LoginForm />
        ) : (
          <WinterizeControl />
        )}
      </Container>
      <br /><br />
      <br /><br />
    </Box>
  );
}
