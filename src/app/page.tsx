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
  Alert,
  IconButton,
  useMediaQuery,
  useTheme,
  Link,
} from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';
import GitHubIcon from '@mui/icons-material/GitHub';

import { DEFAULT_BLOW_OUT_TIME, DEFAULT_RECOVERY_TIME } from 'app/constants/winterizeDefaults';
import { useIsAuth } from 'app/hooks/useAuth';
import { useUrlState } from 'app/hooks/useUrlState';
import { LoginForm } from 'app/components/LoginForm';
import { WinterizeControl } from 'app/components/WinterizeControl/WinterizeControl';

export default function Home() {
  const isAuthenticated = useIsAuth();
  const { isLoadingFromUrl, urlLoadError } = useUrlState();
  const [activePanel, setActivePanel] = useState<null | 'welcome' | 'instructions'>('welcome');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const togglePanel = useCallback((panel: typeof activePanel) => {
    setActivePanel(prev => (prev === panel ? null : panel));
  }, []);

  // Auto-close welcome panel when authenticated, but allow manual override
  useEffect(() => {
    if (isAuthenticated && activePanel === 'welcome') {
      setActivePanel(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <Box>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box>
            {isMobile ? (
              <IconButton onClick={() => togglePanel('welcome')} color="primary">
                <InfoOutlined />
              </IconButton>
            ) : (
              <Button onClick={() => togglePanel('welcome')}>Welcome</Button>
            )}
          </Box>
          <Typography variant="h6" align="center" sx={{ flex: 1 }}>
            Rachio Winterize
          </Typography>
          <Box sx={{ width: isMobile ? 48 : 120 }} /> {/* spacer to keep logo centered */}
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
        <Box
          component="footer"
          sx={{
            py: 2,
            px: 2,
            textAlign: 'center',
            mt: 'auto',
            color: 'text.secondary',
          }}
        >
          <Link
            href="https://github.com/davidcasey"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            color="inherit"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              position: 'relative',
              top: 1,
            }}
          >
            Built by
            <GitHubIcon
              fontSize="small"
              sx={{
                verticalAlign: 'middle',
                position: 'relative',
                top: -0.5,
              }}
            />
            David Casey
          </Link>
        </Box>
      </Container>
    </Box>
  );
}
