import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import Swal from "sweetalert2";
import {
  LogOut,
  Home,
  Search,
  Trophy,
  LogIn,
  UserPlus,
  Menu,
  X,
} from "lucide-react";

function Navbar() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    const confirm = await Swal.fire({
      title: "Log out?",
      text: "You will be signed out from LifeLink.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (confirm.isConfirmed) {
      dispatch(logout());
      navigate("/login");

      Swal.fire({
        icon: "success",
        title: "Logged out",
        text: "You have been successfully signed out.",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="text-xl font-bold text-indigo-600 tracking-tight"
        >
          LifeLink 💞
        </Link>

        <button className="lg:hidden text-gray-700" onClick={toggleMenu}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Links */}
        <div className="hidden lg:flex gap-4 items-center text-gray-700">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="px-3 py-1 rounded-lg transition-colors duration-200 hover:bg-indigo-100 font-medium flex items-center gap-1"
              >
                <Home size={18} /> Dashboard
              </Link>
              <Link
                to="/explore"
                className="px-3 py-1 rounded-lg transition-colors duration-200 hover:bg-indigo-100 font-medium flex items-center gap-1"
              >
                <Search size={18} /> Explore
              </Link>
              <Link
                to="/leaderboard"
                className="px-3 py-1 rounded-lg transition-colors duration-200 hover:bg-indigo-100 font-medium flex items-center gap-1"
              >
                <Trophy size={18} /> Leaderboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors duration-200 flex items-center gap-1"
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-indigo-500 text-white px-4 py-1 rounded hover:bg-indigo-600 transition-colors duration-200 flex items-center gap-1"
              >
                <LogIn size={18} /> Login
              </Link>
              <Link
                to="/signup"
                className="border border-indigo-500 text-indigo-600 px-4 py-1 rounded hover:bg-indigo-50 transition-colors duration-200 flex items-center gap-1"
              >
                <UserPlus size={18} /> Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="mt-3 flex flex-col gap-3 lg:hidden text-gray-700">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="px-3 py-2 rounded-lg hover:bg-indigo-100 transition-colors duration-200 flex items-center gap-2"
                onClick={toggleMenu}
              >
                <Home size={18} /> Dashboard
              </Link>
              <Link
                to="/explore"
                className="px-3 py-2 rounded-lg hover:bg-indigo-100 transition-colors duration-200 flex items-center gap-2"
                onClick={toggleMenu}
              >
                <Search size={18} /> Explore
              </Link>
              <Link
                to="/leaderboard"
                className="px-3 py-2 rounded-lg hover:bg-indigo-100 transition-colors duration-200 flex items-center gap-2"
                onClick={toggleMenu}
              >
                <Trophy size={18} /> Leaderboard
              </Link>
              <button
                onClick={() => {
                  toggleMenu();
                  handleLogout();
                }}
                className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition-colors duration-200 flex items-center gap-2"
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition-colors duration-200 flex items-center gap-2"
                onClick={toggleMenu}
              >
                <LogIn size={18} /> Login
              </Link>
              <Link
                to="/signup"
                className="border border-indigo-500 text-indigo-600 px-4 py-2 rounded hover:bg-indigo-50 transition-colors duration-200 flex items-center gap-2"
                onClick={toggleMenu}
              >
                <UserPlus size={18} /> Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
