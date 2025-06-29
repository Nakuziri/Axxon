
const googleLoginButton = () => {
  const handleLogin = () => {
    window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:3000/api/auth/google/callback&response_type=code&scope=openid%20email%20profile';
  };

  return (
    <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">
      Sign in with Google
    </button>
  );
};

export default googleLoginButton;