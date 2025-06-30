  'use client';

  const GoogleLoginButton = () => {
    const handleLogin = () => {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID; // frontend env vars need NEXT_PUBLIC prefix
      const redirectUri = 'http://localhost:3000/api/auth/google/callback';
      const scope = 'openid email profile';
      
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}`;

      window.location.href = authUrl;
    };

    return (
      <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">
        Sign in with Google
      </button>
    );
  };

  export default GoogleLoginButton;