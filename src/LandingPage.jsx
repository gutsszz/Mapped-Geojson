import { useState } from 'react';
import LoginForm from './LoginForm';
import globeImage from './assets/image1.jpg';
const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div 
      className="flex justify-center items-center h-screen bg-cover bg-center bg-no-repeat" 
      style={{ backgroundImage:  `url(${globeImage})`}} // Add a real globe image URL here
    >
      <div className="backdrop-blur-sm bg-white/30 p-8 rounded-lg shadow-md">
        {!showLogin ? (
          <>
            <h1 className="text-4xl font-bold text-white mb-8 text-center">Visualize your data</h1>
            <button
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition w-full"
              onClick={() => setShowLogin(true)}
            >
              Get Started
            </button>
          </>
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  );
};

export default LandingPage;
