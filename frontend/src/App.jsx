import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateRequest from "./pages/CreateRequest";
import MyRequests from "./pages/MyRequests";
import MyMatches from "./pages/MyMatches";
import Explore from "./pages/Explore";
import Leaderboard from "./pages/Leaderboard";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-request" element={<CreateRequest />} />
        <Route path="/my-requests" element={<MyRequests />} />
        <Route path="/my-matches" element={<MyMatches />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/chat/:id" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="*"
          element={
            <h1 className="text-center mt-20 text-xl text-red-600">
              404 - Page Not Found
            </h1>
          }
        />
      </Routes>
    </>
  );
}

export default App;
