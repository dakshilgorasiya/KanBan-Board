import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";

const ManageEmployee = () => {
  // Sample employees list (replace with your API data)
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        // call api
        const dummyData = [
          { id: 1, name: "Alice", email: "alice@example.com" },
          { id: 2, name: "Bob", email: "bob@example.com" },
          { id: 3, name: "Charlie", email: "charlie@example.com" },
        ];

        setEmployees(dummyData);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch employees. Please try again.");
        console.error("Error fetching employees:", error);
        return;
      }
    };
    fetchEmployees();
  }, []);

  const handleDelete = (id) => {
    try {
      setLoading(true);
      //todo: call api to delete employee
      setEmployees(employees.filter((emp) => emp.id !== id));
      setLoading(false);
    } catch (error) {
      setError("Failed to delete employee. Please try again.");
      console.error("Error deleting employee:", error);
      return;
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
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Employee
        </Link>
      </div>

      <div className="space-y-3">
        {employees.map((emp) => (
          <div
            key={emp.id}
            className="flex justify-between items-center bg-gray-100 p-3 rounded"
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
