import React, { useEffect, useState } from "react";
import axios from "axios";

function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  let token = "";
  try {
    token = JSON.parse(localStorage.getItem("user"))?.token;
  } catch (e) {
    setError("Invalid user session");
  }

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/leaderboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsers(res.data);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to load leaderboard");
      }
    };

    if (token) fetchLeaderboard();
  }, [token]);

  const getRankEmoji = (rank) => {
    if (rank === 0) return "🥇";
    if (rank === 1) return "🥈";
    if (rank === 2) return "🥉";
    return `#${rank + 1}`;
  };

  const getColorClass = (color) => {
    switch (color) {
      case "yellow":
        return "text-yellow-500";
      case "orange":
        return "text-orange-500";
      case "purple":
        return "text-purple-600";
      case "blue":
        return "text-blue-500";
      case "gray":
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-indigo-700 text-center sm:text-left">
        🌟 Karma Leaderboard
      </h2>

      {error && (
        <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4 text-center text-sm">
          {error}
        </div>
      )}

      {users.length === 0 ? (
        <p className="text-gray-600 text-center">No users found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full table-auto min-w-[350px]">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="py-2 px-4 text-left">Rank</th>
                <th className="py-2 px-4 text-left">User</th>
                <th className="py-2 px-4 text-left">Karma</th>
                <th className="py-2 px-4 text-left">Badge</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr
                  key={u._id}
                  className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                >
                  <td className="py-2 px-4 font-semibold">{getRankEmoji(idx)}</td>
                  <td className="py-2 px-4 font-medium break-words">{u.userName}</td>
                  <td className="py-2 px-4 text-green-600 font-semibold">{u.karma}</td>
                  <td className={`py-2 px-4 font-semibold ${getColorClass(u.badge?.color)}`}>
                    {u.badge?.label || "🌱 Newbie"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;

