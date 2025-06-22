import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6 py-16 bg-gradient-to-br from-indigo-100 via-white to-pink-100">
      <div className="max-w-4xl w-full text-center space-y-6 bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-indigo-700 leading-tight">
          Welcome to <span className="text-pink-500">LifeLink 💞</span>
        </h1>

        <p className="text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
          LifeLink is your universal help-exchange platform — connecting people
          in need with those ready to make a difference. Whether it's blood, emotional support, tutoring, or any skill — 
          <span className="font-semibold text-indigo-600"> you can be someone’s hero today.</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Link
            to="/signup"
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-indigo-700 transition text-lg font-medium"
          >
            🚀 Join the Network
          </Link>
          <Link
            to="/explore"
            className="border-2 border-indigo-600 text-indigo-600 px-6 py-3 rounded-xl hover:bg-indigo-50 transition text-lg font-medium"
          >
            🔍 Explore Requests
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
