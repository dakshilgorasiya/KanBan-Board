import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import { BACKEND_URL } from "../Constant.js";
import axios from "axios";

const ManageEmployee = () => {
  // Sample employees list (replace with your API data)
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      console.log("Fetching employees...");
      try {
        // call api
        const response = await axios
          .get(`${BACKEND_URL}/User/Get-All-Employees`, {
            withCredentials: true,
          })
          .then((res) => res.data);
        setEmployees(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch employees. Please try again.");
        console.error("Error fetching employees:", error);
        return;
      }
    };
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `${BACKEND_URL}/User/Remove-Employee/${id}`,
        {
          withCredentials: true,
        }
      );

      setEmployees(employees.filter((emp) => emp.id !== id));
    } catch (error) {
      setError("Failed to delete employee. Please try again.");
      console.error("Error deleting employee:", error);
      return;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <Snackbar
        open={!!error}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Employees</h1>
        <Link
          to="/add-employee"
          className="bg-white/20 backdrop-blur-md text-black px-4 py-2 rounded-xl"
        >
          Add Employee
        </Link>
      </div>

      <div className="space-y-3">
        {employees.map((emp) => (
          <div
            key={emp.id}
            className="flex justify-between items-center bg-gray-100/30 p-3 rounded-xl"
          >
            <div>
              <p className="font-medium">{emp.name}</p>
              <p className="text-sm text-gray-600">{emp.email}</p>
            </div>
            <button
              onClick={() => handleDelete(emp.id)}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageEmployee;
