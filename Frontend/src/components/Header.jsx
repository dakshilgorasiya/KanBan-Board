import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../store/features/authSlice.js";
import { useNavigate, Link } from "react-router-dom";

function Header() {
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(removeUser());
    navigate("/login");
  };

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  if (!isLoggedIn) return null; // Don't render header if not logged in

  return (
    <header className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
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
