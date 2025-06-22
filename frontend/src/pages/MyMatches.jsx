import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function MyMatches() {
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState("");

  let token = "";
  try {
    token = JSON.parse(localStorage.getItem("user"))?.token;
  } catch (e) {
    setError("Invalid user session.");
  }

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/requests/matched-to-me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMatches(res.data);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to fetch matches");
      }
    };

    if (token) fetchMatches();
  }, [token]);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-indigo-700 text-center sm:text-left">
        🤝 My Matched Requests
      </h2>

      {error && (
        <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4 text-sm text-center">
          {error}
        </div>
      )}

      {matches.length === 0 ? (
        <p className="text-gray-600 text-center">
          You haven’t matched to help any requests yet.
        </p>
      ) : (
        <div className="space-y-4">
          {matches.map((req) => (
            <div
              key={req._id}
              className="bg-white p-4 rounded-xl shadow border flex flex-col gap-1"
            >
              <h3 className="text-lg font-semibold text-indigo-800">
                {req.title}
              </h3>
              <p className="text-sm text-gray-600">{req.description}</p>
              <div className="text-sm text-gray-500">
                <p>
                  <strong>Category:</strong> {req.category}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className="font-medium text-yellow-600">
                    {req.status}
                  </span>
                </p>
              </div>

              <Link
                to={`/chat/${req.createdBy._id}`}
                className="mt-2 text-indigo-600 hover:underline text-sm"
              >
                💬 Chat with requester
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyMatches;
