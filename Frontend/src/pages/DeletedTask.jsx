import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Trash2, FileText, Eye } from "lucide-react";
import axios from "axios";
import { BACKEND_URL } from "../Constant.js";
import { AlertTriangle, X } from "lucide-react";

const initialState = [
  {
    id: 1,
    name: "Task 1",
    description: "des1",
  },
  {
    id: 2,
    name: "Task 2",
    description: "des2",
  },
  {
    id: 3,
    name: "Task 3",
    description: "des3",
  },
];

function DeletedTask() {
  const [tasks, setTasks] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await axios
          .get(`${BACKEND_URL}/Task/GetDeletedTasks`, {
            withCredentials: true,
          })
          .then((res) => res.data);

        setTasks(response);
        console.log("Fetched tasks:", response);
      } catch (error) {
        setError("Failed to fetch tasks. Please try again.");
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

    const handleClose = () => {
    setError("");
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-white/60 rounded-lg w-48 mb-6"></div>
            <div className="bg-white/60 rounded-2xl p-8">
              <div className="h-6 bg-white/60 rounded w-64 mb-4"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-white/60 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Error Alert */}
        {error && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-xl shadow-2xl border-l-4 border-red-300 min-w-[320px] max-w-md backdrop-blur-sm">
            <div className="flex items-start space-x-3">
              {/* Error Icon */}
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-white" />
                </div>
              </div>
              
              {/* Error Content */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm mb-1 tracking-wide">Error</h4>
                <p className="text-sm text-red-50 leading-relaxed break-words opacity-90">
                  {error}
                </p>
              </div>
              
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="flex-shrink-0 ml-2 p-1 hover:bg-white hover:bg-opacity-20 rounded-full"
                aria-label="Close error message"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-8 bg-gradient-to-b from-red-500 to-pink-500 rounded-full"></div>
            <h1 className="text-3xl font-bold text-gray-800">Deleted Tasks</h1>
          </div>

          {/* Stats Card */}
          <div className="bg-white/80 border border-white/20 rounded-2xl p-6 shadow-lg mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Total Deleted Tasks
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="bg-white/80 border border-white/20 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Task List</h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  No Deleted Tasks
                </h3>
                <p className="text-gray-500">
                  There are no deleted tasks to display.
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-200/50">
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      ID
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Description
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr
                      key={task.id}
                      className="border-b border-gray-100/50 hover:bg-gray-50/30 transition-colors duration-200"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {task.id}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-medium text-gray-800">
                          {task.name}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-600">
                          {task.description}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                          onClick={() => navigate(`/task-logs/${task.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                          View Logs
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeletedTask;
