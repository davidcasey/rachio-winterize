import { JSX, useState } from 'react';
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
    <form onSubmit={handleSubmit}>
      <label htmlFor="apiKey">
        API Token 
        <small>
          <a href="https://rachio.readme.io/docs/authentication" target="_blank">
            locate your token
          </a>
        </small>
      </label>
      <input
        id="apiKey"
        type="text"
        placeholder="Enter your API key"
        onChange={(e) => {
          setToken(e.target.value);
          setError(null);
        }}
        value={token}
      />
      <button type="submit">Submit</button>
      {error && <p className="error">{error}</p>}
      <p>
        Your Rachio API token is never stored on the server and only used for the duration of your session. Accessing the site over a public network is not recommended.
      </p>
    </form>
  );
}
