import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

function Profile() {
  const { user } = useSelector((state) => state.user);
  const token = user?.token;

  const [form, setForm] = useState({
    userName: "",
    email: "",
    bio: "",
  });
  const [karma, setKarma] = useState(0);
  const [badge, setBadge] = useState({ label: "🌱 Newbie", color: "gray" });

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;

        setForm({
          userName: data.userName || "",
          email: data.email || "",
          bio: data.bio || "",
        });

        setKarma(data.karma || 0);

        // Compute badge
        if (data.karma >= 1000) {
          setBadge({ label: "🏆 Legend", color: "yellow" });
        } else if (data.karma >= 500) {
          setBadge({ label: "🔥 Hero", color: "orange" });
        } else if (data.karma >= 250) {
          setBadge({ label: "💎 Pro", color: "purple" });
        } else if (data.karma >= 100) {
          setBadge({ label: "⭐ Contributor", color: "blue" });
        } else {
          setBadge({ label: "🌱 Newbie", color: "gray" });
        }
      } catch (err) {
        Swal.fire("Error", "Failed to load profile", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/users/me`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire("Success", "Profile updated!", "success");
      setEditing(false);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.msg || "Update failed", "error");
    }
  };

  const getBadgeColorClass = (color) => {
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
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">👤 My Profile</h2>

      {loading ? (
        <p className="text-gray-500">Loading profile...</p>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              <strong>Karma:</strong>{" "}
              <span className="text-green-600 font-semibold">{karma}</span>
            </p>
            <p className={`text-sm font-semibold ${getBadgeColorClass(badge.color)}`}>
              {badge.label}
            </p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Username</label>
            <input
              type="text"
              name="userName"
              value={form.userName}
              onChange={handleChange}
              disabled={!editing}
              className={`w-full border p-2 rounded ${
                editing ? "bg-white" : "bg-gray-100"
              }`}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              disabled
              className="w-full border p-2 rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              rows={3}
              onChange={handleChange}
              disabled={!editing}
              className={`w-full border p-2 rounded ${
                editing ? "bg-white" : "bg-gray-100"
              }`}
            />
          </div>

          <div className="flex justify-end gap-3">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="border px-4 py-2 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;

