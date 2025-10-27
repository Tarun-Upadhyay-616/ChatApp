import React from 'react';
import Logo from '../assets/logo.png';
const SplashScreen = () => {
  return (
    <div className="flex items-center justify-center h-[100vh] w-screen bg-gray-900 overflow-hidden">
      <img
        src={Logo}
        alt="Synk Loading..."
        className="w-64 h-64 md:w-75 md:h-75 object-contain animate-zoom-in invert"
      />
    </div>
  );
};

export default SplashScreen;