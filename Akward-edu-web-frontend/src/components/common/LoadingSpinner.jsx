import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-t-blue-500 border-r-yellow-400 border-b-red-500 border-l-green-400 rounded-full animate-spin"></div>
          
          <div className="absolute inset-2 border-4 border-t-purple-500 border-r-pink-400 border-b-orange-500 border-l-teal-400 rounded-full animate-spin-slow"></div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p className="mt-4 text-lg font-medium text-gray-700">Loading...</p>
        <p className="text-sm text-gray-500">Please wait a moment</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;