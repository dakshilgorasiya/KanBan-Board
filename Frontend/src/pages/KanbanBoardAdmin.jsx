import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";
import { Snackbar, Alert } from "@mui/material";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../Constant.js";

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

    try {
      // call api to update the task
      const response = await axios.put(
        `${BACKEND_URL}/Task/MoveTask`,
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
    } catch (error) {
      setError("Failed to add category. Please try again.");
      console.error("Error adding category:", error);
      return;
    }
    const id = uuidv4();
    setColumns({
      ...columns,
      [id]: {
        name: newCategory,
        items: [],
        canDelete: true,
      },
    });
    setNewCategory("");
  };

  const handleDeleteCategory = async (id, columnId) => {
    if (columns[columnId].items.length > 0) {
      setError("Cannot delete category with tasks in it.");
      return;
    }
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

      const formData = {
        title: newTask.title,
        description: newTask.description,
        currentCategoryId: columns["todo"].categoryId,
        assignTo: parseInt(newTask.assignedTo, 10),
      };

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
        assignedTo: newTask.assignedTo,
        employeeName: response.data.employeeName,
        employeeId: response.data.assignTo,
        taskId: response.data.taskId,
      };

      setColumns({
        ...columns,
        todo : {
          ...columns[todo],
          items: [...columns[todo].items, task],
        },
      });

      setNewTask({
        title: "",
        description: "",
        columnId: "todo",
        assignedTo: "",
      });
    } catch (error) {
      setError("Failed to add task. Please try again.");
      console.log("Error adding task:", error);
      return;
    }
  };

  const handleDeleteTask = (colId, taskId) => {
    try {
      // Call API to delete task
      console.log(taskId);
    } catch (error) {
      setError("Failed to delete task. Please try again.");
      console.error("Error deleting task:", error);
      return;
    }

    setColumns({
      ...columns,
      [colId]: {
        ...columns[colId],
        items: columns[colId].items.filter((item) => item.id !== taskId),
      },
    });
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
      <Snackbar
        open={!!error}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>

      {/* Add Category */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New Category Name"
          className="border p-2 rounded"
        />
        <button
          onClick={handleAddCategory}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Category
        </button>
      </div>

      {/* Add Task */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <input
          type="text"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          placeholder="Task Title"
          className="border p-2 rounded"
        />
        <input
          type="text"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
          placeholder="Task Description"
          className="border p-2 rounded"
        />
        <select
          value={newTask.assignedTo}
          onChange={(e) =>
            setNewTask({ ...newTask, assignedTo: e.target.value })
          }
          className="border p-2 rounded"
        >
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddTask}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Task
        </button>
      </div>

      {/* Columns */}
      <div className="flex flex-wrap gap-4">
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.entries(columns).map(([columnId, column]) => (
            <div
              key={columnId}
              className="bg-gray-100 p-4 rounded w-72 shadow-md flex-shrink-0"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold">{column.name}</h2>
                {column.canDelete && (
                  <button
                    onClick={() =>
                      handleDeleteCategory(column.categoryId, columnId)
                    }
                    className="text-red-600 text-sm cursor-pointer"
                  >
                    Delete
                  </button>
                )}
              </div>
              <Droppable droppableId={columnId}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[100px] space-y-2"
                  >
                    {column.items.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="p-3 bg-white rounded shadow relative"
                          >
                            <h3 className="font-semibold">{item.title}</h3>
                            <p className="text-sm text-gray-600">
                              {item.description}
                            </p>
                            {item.assignedTo && (
                              <p className="text-sm text-blue-600 font-medium">
                                👤 Assigned to: {item.assignedTo}
                              </p>
                            )}
                            <button
                              onClick={() =>
                                handleDeleteTask(columnId, item.id)
                              }
                              className="absolute top-1 right-1 text-xs text-red-500 cursor-pointer"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
}

export default KanbanBoardAdmin;
