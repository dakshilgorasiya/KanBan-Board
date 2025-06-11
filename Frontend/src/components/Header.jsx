import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../store/features/authSlice.js";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../Constant.js";
import { setUser } from "../store/features/authSlice.js";
import { Snackbar, Alert } from "@mui/material";

function Header() {
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleLogout = () => {
    try {
      const response = axios.post(
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
      return;
    }
  };

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios
        .get(`${BACKEND_URL}/User/Get-CurrentUser`, {
          withCredentials: true,
        })
        .then((res) => res.data);

      response.data.isAdmin = response?.data?.role === "Admin" ? true : false;

      dispatch(setUser(response.data));
    };

    fetchUser();
  }, []);

  if (!isLoggedIn) return null; // Don't render header if not logged in

  return (
    <header className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
      <Snackbar
        open={!!error}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>

      <Link to="/" className="text-white">
        <h1 className="text-xl font-semibold">Kanban System</h1>
      </Link>

      <nav className="flex items-center gap-4">
        {isAdmin && (
          <>
            <Link to="/all-logs" className="hover:underline">
              View Logs
            </Link>
            <Link to="/manage-employees" className="hover:underline">
              Manage Employees
            </Link>
          </>
        )}
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100 transition"
        >
          Logout
        </button>
      </nav>
    </header>
  );
}

export default Header;
