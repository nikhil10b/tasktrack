import React from 'react';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-50">
     
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Task Management</h1>

     
      <div className="space-y-4">
        <div className="bg-gray-200 p-4 rounded-lg">
          <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none transition duration-300 ease-in-out">
            <a href="/login" className="w-full text-center">Login</a>
          </button>
        </div>
        <div className="bg-gray-200 p-4 rounded-lg">
          <button className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none transition duration-300 ease-in-out">
            <a href="/register" className="w-full text-center">Sign Up</a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
