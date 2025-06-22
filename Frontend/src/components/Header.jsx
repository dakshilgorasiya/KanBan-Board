import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../store/features/authSlice.js";
import { useNavigate, Link, NavLink } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../Constant.js";
import { setUser } from "../store/features/authSlice.js";
import { Snackbar, Alert } from "@mui/material";

// Mobile Navigation Link Component
const MobileNavLink = ({ to, onClick, icon, children }) => {
  const getIcon = (iconName) => {
    switch (iconName) {
      case "trash":
        return (
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        );
      case "users":
        return (
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
          isActive
            ? "bg-blue-500/20 text-blue-300 border border-blue-400/30"
            : "text-white hover:bg-white/10 hover:text-blue-200"
        }`
      }
    >
      {getIcon(icon)}
      <span className="font-medium">{children}</span>
    </NavLink>
  );
};

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

    if (isLoggedIn) {
      fetchUser();
    }
  }, [dispatch, isLoggedIn]);

  // Close mobile menu when clicking outside or on navigation
  useEffect(() => {
    const handleClickOutside = (event) => {
      const mobileMenu = document.querySelector(".mobile-menu-container");
      const menuButton = document.querySelector(".mobile-menu-button");

      if (
        isMenuOpen &&
        mobileMenu &&
        !mobileMenu.contains(event.target) &&
        !menuButton.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location?.pathname]);

  if (!isLoggedIn) return null;

  return (
    <>
      {/* Enhanced Snackbar */}
      <Snackbar
        open={!!error}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={5000}
        onClose={() => setError(null)}
        style={{ zIndex: 9999 }}
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
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900"></div>
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
                onClick={() => setIsMenuOpen(false)}
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
                    <NavLink
                      to="/deletedTask"
                      className={({ isActive }) =>
                        `hover:underline transition-colors ${
                          isActive ? "text-blue-300" : "text-white"
                        }`
                      }
                    >
                      Deleted Tasks
                    </NavLink>
                    <NavLink
                      to="/manage-employees"
                      className={({ isActive }) =>
                        `hover:underline transition-colors ${
                          isActive ? "text-blue-300" : "text-white"
                        }`
                      }
                    >
                      Manage Team
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
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
                className="mobile-menu-button lg:hidden p-3 text-white hover:bg-white/10 rounded-xl transition-all duration-200 backdrop-blur-md border border-white/20 relative z-50"
                aria-label="Toggle mobile menu"
                aria-expanded={isMenuOpen}
              >
                <svg
                  className="w-6 h-6 transition-transform duration-200"
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
          </div>
        </header>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mobile-menu-container fixed inset-x-0 top-0 z-40 pt-24">
            <div className="mx-4 mt-2 p-4 bg-slate-900/95 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
              <nav className="flex flex-col space-y-3">
                {/* Mobile User Info */}
                {user && (
                  <div className="flex items-center space-x-3 px-4 py-3 bg-white/5 rounded-xl border-b border-white/10 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {(user.name || user.email || "U").charAt(0).toUpperCase()}
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
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
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
          </div>
        )}

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </div>
    </>
  );
}

export default Header;
