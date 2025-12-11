import React, { useState } from 'react';
import SignupModal from './SignupModal';

const Hero = () => {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-radial from-purple-900/30 via-transparent to-transparent"></div>
        
        {/* Animated gradient orb */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-full px-4 py-2 mb-8">
            <span className="text-purple-400 text-sm">✨</span>
            <span className="text-gray-300 text-sm">New: AI integration just landed</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
            Think better with PopcornPing
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto">
            Never miss a note, idea or connection. Video call with screen sharing made simple.
          </p>

          {/* CTA Button */}
          <button
            onClick={() => setShowSignup(true)}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg font-semibold rounded-lg transition transform hover:scale-105 shadow-lg shadow-purple-500/50"
          >
            Start Free Trial
          </button>

          {/* Preview mockup - You can add your image/video here */}
          <div className="mt-20 relative">
            <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden shadow-2xl">
              {/* Browser chrome mockup */}
              <div className="flex items-center space-x-2 px-4 py-3 border-b border-gray-700">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              </div>
              
              {/* Placeholder for your app preview image/video */}
              <div className="aspect-video bg-gradient-to-br from-purple-900/20 to-blue-900/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center opacity-50">
                    <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">Your app preview here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSignup && <SignupModal onClose={() => setShowSignup(false)} />}
    </>
  );
};

export default Hero;