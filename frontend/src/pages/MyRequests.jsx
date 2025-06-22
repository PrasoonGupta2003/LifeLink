import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("user")).token;

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/requests/mine`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setRequests(res.data);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to load requests");
      }
    };

    fetchRequests();
  }, []);

  const handleEndRequest = async (id) => {
    const confirm = await Swal.fire({
      title: "End Request?",
      text: "This will cancel the help request permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it",
      cancelButtonText: "Keep it open",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = JSON.parse(localStorage.getItem("user")).token;
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/requests/end/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRequests((prev) =>
        prev.map((req) =>
          req._id === id ? { ...req, status: "cancelled" } : req
        )
      );

      Swal.fire("Cancelled!", "Your request has been ended.", "success");
    } catch (err) {
      Swal.fire("Error", "Failed to end request", "error");
    }
  };

  const handleDeleteAll = async () => {
    const confirm = await Swal.fire({
      title: "Delete All Requests?",
      text: "This will permanently remove all your posted requests.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete all",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = JSON.parse(localStorage.getItem("user")).token;
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/requests/mine`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRequests([]);
      Swal.fire("Deleted!", "All your requests have been deleted.", "success");
    } catch (err) {
      Swal.fire("Error", "Failed to delete requests", "error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-indigo-700 text-center sm:text-left">
        📝 My Posted Requests
      </h2>

      {error && (
        <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4 text-sm text-center">
          {error}
        </div>
      )}

      {requests.length === 0 ? (
        <p className="text-gray-600 text-center">
          You haven’t posted any requests yet.
        </p>
      ) : (
        <>
          <div className="flex justify-end">
            <button
              onClick={handleDeleteAll}
              className="mb-4 bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 text-sm sm:text-base"
            >
              🗑️ Delete All Requests
            </button>
          </div>

          <div className="space-y-4">
            {requests.map((req) => (
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
                    <span
                      className={`font-medium ${
                        req.status === "open"
                          ? "text-green-600"
                          : req.status === "matched"
                          ? "text-yellow-600"
                          : req.status === "cancelled"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {req.status}
                    </span>
                  </p>
                  {req.neededBy && (
                    <p className="text-xs text-gray-400">
                      Needed by:{" "}
                      {new Date(req.neededBy).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {req.status === "open" && (
                  <button
                    onClick={() => handleEndRequest(req._id)}
                    className="mt-2 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    ❌ End Request
                  </button>
                )}

                {req.status === "matched" && req.matchedTo && (
                <button
                  onClick={() =>
                    window.location.href = `/chat/${req.matchedTo._id}`
                  }
                  className="mt-2 px-4 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                >
                  💬 Chat with {req.matchedTo.userName}
                </button>
              )}

              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default MyRequests;
