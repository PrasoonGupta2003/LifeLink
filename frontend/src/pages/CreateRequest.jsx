import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateRequest() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    type: "Free",
    location: "",
    neededBy: "",
    tags: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const token = JSON.parse(localStorage.getItem("user")).token;

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/requests/create`,
        {
          ...form,
          tags: form.tags.split(",").map((tag) => tag.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/my-requests");
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to create request");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-indigo-700 text-center">
        Create Help Request
      </h2>

      {error && (
        <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4 text-sm text-center">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 sm:p-6 rounded-xl shadow-md space-y-4"
      >
        <input
          type="text"
          name="title"
          placeholder="Title (e.g., Need Blood in Lucknow)"
          value={form.title}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded text-sm"
          required
        />

        <textarea
          name="description"
          placeholder="Describe the help you need"
          value={form.description}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded text-sm"
          rows={4}
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category (e.g., Blood, Emotional, Tutoring)"
          value={form.category}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded text-sm"
          required
        />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded text-sm"
        >
          <option value="Free">Free</option>
          <option value="Paid">Paid</option>
          <option value="Barter">Barter</option>
        </select>

        <input
          type="text"
          name="location"
          placeholder="Location (optional)"
          value={form.location}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded text-sm"
        />

        <input
          type="date"
          name="neededBy"
          value={form.neededBy}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded text-sm"
        />

        <input
          type="text"
          name="tags"
          placeholder="Tags (comma separated, e.g. urgent,delhi,blood)"
          value={form.tags}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded text-sm"
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition text-sm font-medium"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
}

export default CreateRequest;
