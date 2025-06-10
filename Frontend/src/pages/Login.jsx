import { useState, useEffect } from "react";
import { setUser } from "../store/features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../Constant.js";
import { Snackbar, Alert } from "@mui/material";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isAdmin = useSelector((state) => state.auth.isAdmin);

  useEffect(() => {
    if (isLoggedIn) {
      if (isAdmin) {
        navigate("/kanban-board-admin");
      } else {
        navigate("/kanban-board-employee");
      }
    }
  }, [isLoggedIn, isAdmin]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login submitted:", formData);

    try {
      setLoading(true);
      setError(null);

      const response = await axios
        .post(`${BACKEND_URL}/auth/login`, formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => res.data);

      response.data.isAdmin = response?.data?.role === "Admin" ? true : false;

      console.log("Login response:", response.data);

      dispatch(setUser(response.data));

      if (response.data.isAdmin) {
        navigate("/kanban-board-admin");
      } else {
        navigate("/kanban-board-employee");
      }
    } catch (error) {
      console.log("Login error:", error);
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }

    //todo : call api and then store response in redux
    // dispatch(setUser(dummyResponse));

    // if (dummyResponse.isAdmin) {
    //   navigate("/kanban-board-admin");
    // } else {
    //   navigate("/kanban-board-employee");
    // }
  };

  return (
    <>
      <Snackbar
        open={!!error}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>
      <div className="flex w-full h-screen justify-center items-center">
        <div className="mx-auto mt-10 p-6 border rounded-xl shadow-lg bg-white h-max w-80">
          <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium mt-6"
              >
                Email
              </label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                required
              />
            </div>
            {loading ? (
              <button
                type="submit"
                disabled
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition mt-10 cursor-pointer"
              >
                loading..
              </button>
            ) : (
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition mt-10 cursor-pointer"
              >
                Login
              </button>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
