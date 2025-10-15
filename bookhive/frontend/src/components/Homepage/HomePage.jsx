import React from "react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-orange-500 text-white p-8">
        <h1 className="text-4xl font-bold">Welcome to BookHive</h1>
        <p className="text-xl">Test - Can you see this?</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <p className="text-gray-900">
          If you can see this, the component is working!
        </p>
      </div>
    </div>
  );
};

export default HomePage;
