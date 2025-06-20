import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../store/features/authSlice.js";
import { useNavigate, Link, NavLink } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../Constant.js";
import { setUser } from "../store/features/authSlice.js";
import { Snackbar, Alert } from "@mui/material";

function Header() {
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await axios.post(
        `${BACKEND_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      dispatch(removeUser());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      setError("Logout failed. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/User/Get-CurrentUser`,
          {
            withCredentials: true,
          }
        );

        const userData = response.data.data;
        userData.isAdmin = userData?.role === "Admin";

        dispatch(setUser(userData));
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setError("Failed to load user information");
      }
    };

    fetchUser();
  }, [dispatch, isLoggedIn]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest(".mobile-menu")) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMenuOpen]);

  if (!isLoggedIn) return null;

  return (
    <>
      {/* Enhanced Snackbar */}
      <Snackbar
        open={!!error}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={5000}
        onClose={() => setError(null)}
        className="z-50"
      >
        <Alert
          severity="error"
          variant="filled"
          onClose={() => setError(null)}
          className="shadow-2xl border-l-4 border-red-300"
          sx={{
            "& .MuiAlert-icon": {
              color: "white",
            },
          }}
        >
          {error}
        </Alert>
      </Snackbar>

      {/* Main Header */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 animate-gradient-x"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20"></div>
        <div className="absolute inset-0 backdrop-blur-sm"></div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Content Container */}
        <header className="relative z-10 px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              {/* Enhanced Logo Section */}
              <Link
                to="/"
                className="flex items-center space-x-4 group transition-all duration-300 hover:scale-105"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl border border-white/20">
                    <svg
                      className="w-7 h-7 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                    TaskFlow
                  </h1>
                  <p className="text-sm text-blue-200/80 font-medium">
                    Management System
                  </p>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-2">
                {isAdmin && (
                  <div className="flex items-center space-x-5 mr-6 text-white">
                    <NavLink to="/deletedTask" icon="trash">
                      <p className="hover:underline">Deleted Tasks</p>
                    </NavLink>
                    <NavLink to="/manage-employees" icon="users">
                      <p className="hover:underline">Manage Team</p>
                    </NavLink>
                  </div>
                )}

                {/* User Profile Section */}
                {user && (
                  <div className="flex items-center space-x-4 px-4 py-2 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {(user.name || user.email || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="text-white">
                      <div className="font-semibold text-sm leading-tight">
                        {user.name || user.email}
                      </div>
                      {isAdmin && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 rounded-full text-xs font-bold">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Enhanced Logout Button */}
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="group relative px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center space-x-2">
                    {isLoggingOut ? (
                      <>
                        <svg
                          className="w-4 h-4 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Signing out...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        <span>Logout</span>
                      </>
                    )}
                  </div>
                </button>
              </nav>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-3 text-white hover:bg-white/10 rounded-xl transition-all duration-200 backdrop-blur-md border border-white/20"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>

            {/* Mobile Navigation Menu */}
            {isMenuOpen && (
              <div className="lg:hidden mobile-menu mt-6 p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
                <nav className="flex flex-col space-y-3">
                  {/* Mobile User Info */}
                  {user && (
                    <div className="flex items-center space-x-3 px-4 py-3 bg-white/5 rounded-xl border-b border-white/10 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {(user.name || user.email || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      <div className="text-white">
                        <div className="font-semibold">
                          {user.name || user.email}
                        </div>
                        {isAdmin && (
                          <span className="inline-block mt-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 rounded-full text-xs font-bold">
                            Admin
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Mobile Navigation Links */}
                  {isAdmin && (
                    <>
                      <MobileNavLink
                        to="/deletedTask"
                        onClick={() => setIsMenuOpen(false)}
                        icon="trash"
                      >
                        Deleted Tasks
                      </MobileNavLink>
                      <MobileNavLink
                        to="/manage-employees"
                        onClick={() => setIsMenuOpen(false)}
                        icon="users"
                      >
                        Manage Team
                      </MobileNavLink>
                    </>
                  )}

                  {/* Mobile Logout Button */}
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="group mt-4 px-6 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isLoggingOut ? (
                      <>
                        <svg
                          className="w-5 h-5 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Signing out...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        <span>Logout</span>
                      </>
                    )}
                  </button>
                </nav>
              </div>
            )}
          </div>
        </header>
      </div>
    </>
  );
}

export default Header;
