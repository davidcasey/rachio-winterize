import { JSX, useState } from 'react';
import {
  Box,
  Button,
  InputLabel,
  OutlinedInput,
  Typography,
  Link,
  Stack
} from '@mui/material';

import { useSetAuthToken } from 'app/store/authStore';
import { getIsAuth } from 'app/hooks/useAuth';

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export const LoginForm = (): JSX.Element => {
  const setAuthToken = useSetAuthToken();
  const [token, setToken] = useState<string>(API_KEY || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    await setAuthToken(token);
    setError(getIsAuth() ? null : 'Invalid API token. Please try again.');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
      }}
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400 }}>
        <Stack spacing={2}>
          {/* Label and Input */}
          <Box>
            <InputLabel htmlFor="apiKey">Enter your API Token</InputLabel>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <OutlinedInput
                id="apiKey"
                type="text"
                placeholder="Enter your API key"
                fullWidth
                value={token}
                size='small'
                onChange={(e) => {
                  setToken(e.target.value);
                  setError(null);
                }}
              />
              <Button variant="contained" type="submit">
                Submit
              </Button>
            </Box>
          </Box>

          {/* Error Message */}
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          {/* Link */}
          <Link
            href="https://rachio.readme.io/docs/authentication"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            Locate your token
          </Link>

          {/* Info Paragraph */}
          <Typography variant="caption" color="text.secondary">
            Your Rachio API token is never stored on the server and only used for the duration of your session. Accessing the site over a public network is not recommended.
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}
