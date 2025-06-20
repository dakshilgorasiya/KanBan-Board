import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../Constant";

function TaskLogs() {
  const [taskData, setTaskData] = useState({
    taskName: "",
    currentCategory: "",
    history: [],
  });
  const [loading, setLoading] = useState(true);

  const handleClose = () => {
    setError("");
  };
  const { taskId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios
          .get(`${BACKEND_URL}/Log/GetLogByTaskId/${taskId}`)
          .then((res) => res.data);
        console.log("Fetched task data:", response.data);

        const tempData = {
          taskName: response.data.taskName || "N/A",
          currentCategory: response.data.currentCategory || "N/A",
          history: response.data.logHistory || [],
        };

        console.log(tempData.history);
        setTaskData(tempData);
      } catch (error) {
        console.error("Error fetching task data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [taskId]);

  const { taskName, currentCategory, history } = taskData;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      Todo: "bg-gray-100 text-gray-800 border-gray-200",
      "In Progress": "bg-blue-100 text-blue-800 border-blue-200",
      Done: "bg-green-100 text-green-800 border-green-200",
      Review: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Testing: "bg-purple-100 text-purple-800 border-purple-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-white/60 rounded-lg w-48 mb-6"></div>
            <div className="bg-white/60 rounded-2xl p-8">
              <div className="h-6 bg-white/60 rounded w-64 mb-4"></div>
              <div className="h-6 bg-white/60 rounded w-48 mb-8"></div>
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
            <h1 className="text-3xl font-bold text-gray-800">
              Task Activity Log
            </h1>
          </div>

          {/* Task Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white/80 border border-white/20 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Task Name</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {taskName}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 border border-white/20 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Current Status
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                      currentCategory
                    )}`}
                  >
                    {currentCategory}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Table */}
        <div className="bg-white/80 border border-white/20 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17H7m0 0a3 3 0 01-3-3V4a3 3 0 013-3h10a3 3 0 013 3v10a3 3 0 01-3 3H7z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Activity Log
              </h2>
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                {history.length} {history.length === 1 ? "entry" : "entries"}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            {history.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  No Activity Yet
                </h3>
                <p className="text-gray-500">
                  This task hasn't been moved between categories yet.
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-200/50">
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Moved By
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      From
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      To
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Date & Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((log, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100/50 hover:bg-gray-50/30 transition-colors duration-200"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {log.movedBy
                                ? log.movedBy.charAt(0).toUpperCase()
                                : "U"}
                            </span>
                          </div>
                          <span className="font-medium text-gray-800">
                            {log.movedBy || "Unknown"}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                            log.from
                          )}`}
                        >
                          {log.from}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                            log.to
                          )}`}
                        >
                          {log.to}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-gray-600">
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
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="text-sm">{formatDate(log.at)}</span>
                        </div>
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

export default TaskLogs;
