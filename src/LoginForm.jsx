import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Navigate to the Mapbox page without authentication for now
    navigate('/mapbox');
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xs">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <input
        type="text"
        placeholder="Username"
        className="border border-gray-300 rounded px-4 py-2 w-full mb-4 focus:outline-none focus:border-blue-500"
      />
      <input
        type="password"
        placeholder="Password"
        className="border border-gray-300 rounded px-4 py-2 w-full mb-4 focus:outline-none focus:border-blue-500"
      />
      <button
        onClick={handleLogin}
        className="bg-green-500 text-white py-2 px-4 rounded-lg w-full hover:bg-green-600 transition"
      >
        Login
      </button>
    </div>
  );
};

export default LoginForm;
