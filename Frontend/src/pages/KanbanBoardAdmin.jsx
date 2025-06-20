import React, { useEffect, useState, Fragment } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";
import { Snackbar, Alert } from "@mui/material";
import { Link } from "react-router-dom";
import { ArrowRight, AlertTriangle, X } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../Constant.js";
import { Dialog, Transition } from "@headlessui/react";

const intialColumns = {
  todo: {
    name: "To Do",
    items: [],
    canDelete: false,
    categoryId: 0,
  },
  inprogress: {
    name: "In Progress",
    items: [],
    canDelete: false,
    categoryId: 0,
  },
  done: {
    name: "Done",
    items: [],
    canDelete: false,
    categoryId: 0,
  },
};

function KanbanBoardAdmin() {
  const navigate = useNavigate();

  // to store data
  const [columns, setColumns] = useState(intialColumns);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // to store new category and task data
  const [newCategory, setNewCategory] = useState("");

  const [employees, setEmployees] = useState([]);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
  });

  const [isOpen, setIsOpen] = useState(false);

  const [isTaskOpen, setIsTaskOpen] = useState(false);

  const handleClose = () => {
    setError("");
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios
          .get(`${BACKEND_URL}/User/Get-All-Employees`, {
            withCredentials: true,
          })
          .then((res) => res.data);
        setEmployees(response.data);
      } catch (error) {
        setError("Failed to fetch employees. Please try again.");
        console.error("Error fetching employees:", error);
        return;
      }
    };
    fetchEmployees();
  }, []);

  // to get task data from api
  useEffect(() => {
    // call api to get tasks

    const fetchData = async () => {
      try {
        setIsLoading(true);

        const response = await axios
          .get(`${BACKEND_URL}/Task/GetAllTaskAdmin`, {
            withCredentials: true,
          })
          .then((res) => res.data);

        let data = response.data.categoryWiseTask;

        data.map((item) => {
          item.name = item.title;
          item.items = item.tasks;
          item.title = undefined;
          item.tasks = undefined;
          item.items.map((task) => {
            task.id = task.taskId.toString();
            task.assignedTo = task.employeeName;
          });

          if (
            item.name === "Todo" ||
            item.name === "In Progress" ||
            item.name === "Done"
          ) {
            item.canDelete = false;
          } else {
            item.canDelete = true;
          }
        });

        console.log(data);

        setColumns(data);
        setIsLoading(false);
        setError(null);
      } catch (error) {
        setError("Failed to fetch tasks. Please try again.");
        console.error("Error fetching tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // to handle error messages
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    // id of the source and destination columns
    const sourceColId = source.droppableId;
    const destColId = destination.droppableId;

    // get the source and destination columns
    const sourceCol = columns[sourceColId];
    const destCol = columns[destColId];

    // get the items in the source and destination columns
    const sourceItems = Array.from(sourceCol.items);
    const destItems = Array.from(destCol.items);
    const [movedItem] = sourceItems.splice(source.index, 1);

    // restrict moving not needed for admin
    // if (movedItem.lastMainCategory === "inprogress" && destColId === "todo") {
    //   setError(
    //     "Cannot move item as it is in progress and cannot be moved back to To Do."
    //   );
    //   return;
    // }
    // if (movedItem.lastMainCategory === "done" && destColId !== "done") {
    //   setError("Cannot move item as it is done");
    //   return;
    // }

    // update the lastMainCategory of the moved item
    if (destColId === "todo") {
      movedItem.lastMainCategory = "todo";
    } else if (destColId === "inprogress") {
      movedItem.lastMainCategory = "inprogress";
    } else if (destColId === "done") {
      movedItem.lastMainCategory = "done";
    }

    if (sourceColId !== destColId) {
      try {
        // call api to update the task
        const response = await axios.put(
          `${BACKEND_URL}/Task/MoveTask-By-Admin`,
          {
            taskId: movedItem.taskId,
            fromCategoryId: columns[sourceColId].categoryId,
            toCategoryId: columns[destColId].categoryId,
          },
          {
            withCredentials: true,
          }
        );
        // console.log(movedItem.taskId)
        // console.log(columns[sourceColId].categoryId);
        // console.log(columns[destColId].categoryId);
      } catch (error) {
        0;
        console.error("Error updating task:", error);
        setError("Failed to update task. Please try again.");
        return;
      }
    }

    if (sourceColId === destColId) {
      // if source and destination are the same column then just reorder the items
      sourceItems.splice(destination.index, 0, movedItem);
      setColumns({
        ...columns,
        [sourceColId]: {
          ...sourceCol,
          items: sourceItems,
        },
      });
    } else {
      // if source and destination are different columns then move the item to the destination column
      destItems.splice(destination.index, 0, movedItem);
      setColumns({
        ...columns,
        [sourceColId]: {
          ...sourceCol,
          items: sourceItems,
        },
        [destColId]: {
          ...destCol,
          items: destItems,
        },
      });
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      setError("Category name cannot be empty.");
      return;
    }
    try {
      const response = await axios
        .post(
          `${BACKEND_URL}/Category/AddCategory`,
          {
            categoryName: newCategory,
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => res.data);
      const id = response.data.categoryId;
      const oldColumns = { ...columns };
      console.log(oldColumns);
      const len = Object.keys(oldColumns).length;
      oldColumns[id] = {
        id: id.toString(),
        items: [],
        canDelete: true,
        name: newCategory,
        categoryId: id,
      };
      setColumns(oldColumns);
    } catch (error) {
      setError("Failed to add category. Please try again.");
      console.error("Error adding category:", error);
      return;
    }

    setNewCategory("");
    setIsOpen(false);
  };

  const handleDeleteCategory = async (id, columnId) => {
    if (columns[columnId].items.length > 0) {
      setError("Cannot delete category with tasks in it.");
      return;
    }
    console.log(id);
    try {
      // Call API to delete category
      const response = await axios.delete(
        `${BACKEND_URL}/Category/DeleteCategory`,
        {
          params: { id },
          withCredentials: true,
        }
      );

      console.log(id);
    } catch (error) {
      setError("Failed to delete category. Please try again.");
      console.error("Error deleting category:", error);
      return;
    }
    const updated = { ...columns };
    delete updated[columnId];
    setColumns(updated);
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim()) {
      setError("Task title cannot be empty.");
      return;
    }
    if (!newTask.assignedTo) {
      setError("Please assign the task to an employee.");
      return;
    }

    try {
      // Call API to add new task

      console.log(columns);

      const index = columns.findIndex((col) => col.name === "Todo");
      const categoryId = index !== -1 ? columns[index].categoryId : null;

      const formData = {
        title: newTask.title,
        description: newTask.description,
        currentCategoryId: categoryId,
        assignTo: parseInt(newTask.assignedTo, 10),
      };

      console.log(formData);

      const response = await axios
        .post(`${BACKEND_URL}/Task/AddTask`, formData, {
          withCredentials: true,
        })
        .then((res) => res.data);

      console.log(response);
      const task = {
        id: response.data.taskId.toString(),
        title: newTask.title,
        description: newTask.description,
        assignedTo: response.data.employeeName,
        employeeName: response.data.employeeName,
        employeeId: response.data.assignTo,
        taskId: response.data.taskId,
      };

      console.log(task);

      const updatedColumns = [...columns];
      updatedColumns[index] = {
        ...updatedColumns[index],
        items: [...updatedColumns[index].items, task],
      };

      setColumns(updatedColumns);

      setNewTask({
        title: "",
        description: "",
        columnId: "todo",
        assignedTo: "",
      });

      setIsTaskOpen(false);
    } catch (error) {
      setError("Failed to add task. Please try again.");
      console.log("Error adding task:", error);
      return;
    }
  };

  const handleDeleteTask = async (taskId, colId) => {
    try {
      // Call API to delete task
      console.log(taskId);

      const response = await axios
        .delete(`${BACKEND_URL}/Task/DeleteTask`, {
          params: { id: taskId },
          withCredentials: true,
        })
        .then((res) => res.data);

      setColumns({
        ...columns,
        [colId]: {
          ...columns[colId],
          items: columns[colId].items.filter((item) => item.id !== taskId),
        },
      });
    } catch (error) {
      setError("Failed to delete task. Please try again.");
      console.error("Error deleting task:", error);
      return;
    }
  };

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn === false) {
      navigate("/login");
      return;
    }
  }, [isLoggedIn]);

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="p-4">
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
                <h4 className="font-semibold text-sm mb-1 tracking-wide">
                  Error
                </h4>
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

      {/* Add Category */}
      <div>
        {/* Modal */}
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => setIsOpen(false)}
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            <div className="fixed inset-0 flex items-start justify-center pt-20">
              <Transition.Child
                as={Fragment}
                enter="transition ease-out duration-300"
                enterFrom="opacity-0 -translate-y-10 scale-95"
                enterTo="opacity-100 translate-y-0 scale-100"
                leave="transition ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 scale-100"
                leaveTo="opacity-0 -translate-y-10 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white/70 backdrop-blur p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Add New Category
                  </Dialog.Title>

                  <div className="mt-4">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Enter category name"
                      className="w-full border border-gray-300 rounded px-4 py-2"
                    />
                  </div>

                  <div className="mt-6 flex justify-end gap-2">
                    <button
                      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 transition-colors duration-200"
                      onClick={handleAddCategory}
                    >
                      Add
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </div>

      {/* Add Task */}
      <div>
        {/* Trigger Button */}
        <button
          onClick={() => setIsTaskOpen(true)}
          className="bg-white/50 text-black px-4 py-2 rounded-xl ml-6 shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center gap-2 hover:bg-white/70"
        >
          + Add Task
        </button>

        {/* Modal */}
        <Transition appear show={isTaskOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => setIsTaskOpen(false)}
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            <div className="fixed inset-0 flex items-start justify-center pt-20">
              <Transition.Child
                as={Fragment}
                enter="transition ease-out duration-300"
                enterFrom="opacity-0 -translate-y-10 scale-95"
                enterTo="opacity-100 translate-y-0 scale-100"
                leave="transition ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 scale-100"
                leaveTo="opacity-0 -translate-y-10 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-visible rounded-2xl bg-white/70 backdrop-blur p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Add New Task
                  </Dialog.Title>

                  <div className="mt-4 space-y-4">
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) =>
                        setNewTask({ ...newTask, title: e.target.value })
                      }
                      placeholder="Task Title"
                      className="w-full border border-gray-300 rounded px-4 py-2"
                    />
                    <input
                      type="text"
                      value={newTask.description}
                      onChange={(e) =>
                        setNewTask({ ...newTask, description: e.target.value })
                      }
                      placeholder="Task Description"
                      className="w-full border border-gray-300 rounded px-4 py-2"
                    />
                    <select
                      value={newTask.assignedTo}
                      onChange={(e) =>
                        setNewTask({ ...newTask, assignedTo: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded px-4 py-2"
                    >
                      <option value="">Select Employee</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-6 flex justify-end gap-2">
                    <button
                      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                      onClick={() => setIsTaskOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 transition-colors duration-200"
                      onClick={handleAddTask}
                    >
                      Add Task
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </div>

      {/* Columns */}
      <div className="flex flex-wrap gap-6 p-6">
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.entries(columns).map(([columnId, column]) => (
            <div
              key={columnId}
              className="bg-white/80 border border-white/20 rounded-2xl w-80 shadow-lg hover:shadow-xl transition-all duration-200 flex-shrink-0"
            >
              {/* Column Header */}
              <div className="p-5 border-b border-white/20">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {column.name}
                    </h2>
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                      {column.items.length}
                    </span>
                  </div>
                  {column.canDelete && (
                    <button
                      onClick={() =>
                        handleDeleteCategory(column.categoryId, columnId)
                      }
                      className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 rounded-md hover:bg-red-50"
                      title="Delete column"
                    >
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Column Content */}
              <div className="p-4">
                <Droppable droppableId={columnId}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`min-h-[300px] space-y-3 transition-colors duration-200 rounded-lg p-2 ${
                        snapshot.isDraggingOver
                          ? "bg-blue-50 border-2 border-dashed border-blue-300"
                          : ""
                      }`}
                    >
                      {column.items.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`group relative bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-move ${
                                snapshot.isDragging
                                  ? "rotate-2 shadow-lg border-blue-300"
                                  : ""
                              }`}
                            >
                              {/* Drag Handle Indicator */}
                              <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <svg
                                  className="w-3 h-3 text-gray-400"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                              </div>

                              {/* Delete Button */}
                              <button
                                onClick={() =>
                                  handleDeleteTask(item.id, columnId)
                                }
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all duration-200 p-1 rounded-md hover:bg-red-50"
                                title="Delete task"
                              >
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>

                              {/* Task Content */}
                              <div className="pr-8">
                                <h3 className="font-semibold text-gray-800 mb-2 leading-tight">
                                  {item.title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                  {item.description}
                                </p>

                                {item.assignedTo && (
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                      <span className="text-white text-xs font-medium">
                                        {item.assignedTo
                                          .charAt(0)
                                          .toUpperCase()}
                                      </span>
                                    </div>
                                    <span className="text-sm text-gray-700 font-medium">
                                      {item.assignedTo}
                                    </span>
                                  </div>
                                )}

                                {/* Task Footer */}
                                <div className="flex justify-end items-center">
                                  <Link
                                    to={`/task-logs/${item.id}`}
                                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 hover:bg-blue-50 px-2 py-1 rounded-md"
                                    title="View Task Log"
                                  >
                                    <span>View</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                      {/* Empty State */}
                      {column.items.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                          <svg
                            className="w-8 h-8 mx-auto mb-2 opacity-50"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                          </svg>
                          <p className="text-sm">No tasks yet</p>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          ))}
        </DragDropContext>

        {/* Add Column Button */}
        <div className="w-80 flex-shrink-0">
          <button
            onClick={() => setIsOpen(true)}
            className="w-full bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-2xl p-8 min-h-[200px] flex flex-col items-center justify-center gap-3 transition-all duration-200 group"
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200">
              <svg
                className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-gray-600 font-medium group-hover:text-blue-600 transition-colors duration-200">
                Add New Column
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Create a new task category
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default KanbanBoardAdmin;
