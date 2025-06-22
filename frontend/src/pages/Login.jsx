import React, { useState } from "react";
import axios from "axios";
import { setUser } from "../redux/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({
    userName: "",
    password: "",
  });

  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        form
      );
      dispatch(setUser(res.data));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-slate-100 px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg"
      >
        <h2 className="text-2xl font-bold text-indigo-600 mb-6">
          Welcome Back
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <input
          type="text"
          name="userName"
          placeholder="Username"
          value={form.userName}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-6"
          required
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        >
          Login
        </button>

        <p className="text-sm mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <a href="/signup" className="text-indigo-600 hover:underline">
            Sign up here
          </a>
        </p>
      </form>
    </div>
  );
}

export default Login;
