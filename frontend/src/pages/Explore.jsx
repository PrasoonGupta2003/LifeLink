import React, { useEffect, useState } from "react";
import axios from "axios";

function Explore() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const token = JSON.parse(localStorage.getItem("user")).token;

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/requests/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRequests(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to fetch requests");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleMatch = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/requests/match/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("🎯 You’ve matched to this request!");
      fetchRequests();
    } catch (err) {
      setError(err.response?.data?.msg || "Match failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-indigo-700 text-center sm:text-left">
        Explore Help Requests
      </h2>

      {error && (
        <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4 text-sm sm:text-base">
          {error}
        </div>
      )}
      {message && (
        <div className="bg-green-100 text-green-700 px-3 py-2 rounded mb-4 text-sm sm:text-base">
          {message}
        </div>
      )}

      {requests.length === 0 ? (
        <p className="text-gray-600 text-center">No open requests at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-white p-4 rounded-xl shadow-md border flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-indigo-800 mb-1">
                  {req.title}
                </h3>
                <p className="text-sm text-gray-700 mb-2">{req.description}</p>
                <p className="text-sm text-gray-500 mb-1">
                  <strong>Category:</strong> {req.category} |{" "}
                  <strong>Type:</strong> {req.type}
                </p>
                {req.location && (
                  <p className="text-sm text-gray-500">📍 {req.location}</p>
                )}
                {req.neededBy && (
                  <p className="text-xs text-gray-400">
                    Needed by:{" "}
                    {new Date(req.neededBy).toLocaleDateString()}
                  </p>
                )}
              </div>

              <button
                onClick={() => handleMatch(req._id)}
                className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
              >
                🤝 Match to Help
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Explore;

