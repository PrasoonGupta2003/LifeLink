import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Dashboard() {
  const { user } = useSelector((state) => state.user);

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-indigo-700">
        Welcome, {user?.userName} 👋
      </h1>

      <p className="text-gray-600 text-sm sm:text-base mb-6">
        🌟 Every small act of kindness helps shape a better world. Keep sharing, keep helping!
      </p>

      <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-col sm:flex-row justify-between items-center">
        <div className="mb-3 sm:mb-0">
          <p className="text-lg font-semibold text-gray-700">Your Karma Points</p>
          <p className="text-3xl font-bold text-green-600">{user?.karma}</p>
        </div>
        <p className="text-sm text-gray-500 italic">
          💡 Tip: Earn more karma by helping others through requests!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          to="/create-request"
          className="bg-indigo-600 text-white p-5 rounded-xl text-center hover:bg-indigo-700 transition shadow-sm"
        >
          ✍️ Create New Request
        </Link>

        <Link
          to="/my-requests"
          className="bg-yellow-400 text-white p-5 rounded-xl text-center hover:bg-yellow-500 transition shadow-sm"
        >
          📜 My Requests
        </Link>

        <Link
          to="/my-matches"
          className="bg-green-500 text-white p-5 rounded-xl text-center hover:bg-green-600 transition shadow-sm"
        >
          🤝 My Matches
        </Link>

        <Link
          to="/explore"
          className="bg-blue-500 text-white p-5 rounded-xl text-center hover:bg-blue-600 transition shadow-sm"
        >
          🔍 Explore Help Requests
        </Link>

        <Link
          to="/leaderboard"
          className="bg-purple-500 text-white p-5 rounded-xl text-center hover:bg-purple-600 transition shadow-sm"
        >
          🏆 View Leaderboard
        </Link>

        <Link
          to="/profile"
          className="bg-gray-700 text-white p-5 rounded-xl text-center hover:bg-gray-800 transition shadow-sm"
        >
          👤 My Profile
        </Link>
      </div>

      <div className="mt-10 text-center text-sm text-gray-500">
        ❤️ “Be the reason someone believes in the goodness of people.” <br />
        Keep spreading hope, one click at a time.
      </div>
    </div>
  );
}

export default Dashboard;
