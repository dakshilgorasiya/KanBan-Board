import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";
import { Snackbar, Alert } from "@mui/material";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function KanbanBoardAdmin() {
  // to store data
  const [columns, setColumns] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // to store new category and task data
  const [newCategory, setNewCategory] = useState("");

  const [employees, setEmployees] = useState([
    { id: "emp1", name: "Alice" },
    { id: "emp2", name: "Bob" },
    { id: "emp3", name: "Charlie" },
  ]);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    columnId: "todo",
    assignedTo: "",
  });

  // to get task data from api
  useEffect(() => {
    // call api to get tasks
    const dummyResponse = {
      todo: {
        name: "To Do",
        items: [
          {
            id: "task-1",
            title: "Design landing page",
            description: "Create responsive UI",
            lastMainCategory: "todo",
            assignedTo: "Alice",
          },
          {
            id: "task-2",
            title: "Write documentation",
            description: "Document API endpoints",
            lastMainCategory: "todo",
            assignedTo: "Bob",
          },
        ],
        canDelete: false,
      },
      inprogress: {
        name: "In Progress",
        items: [
          {
            id: "task-3",
            title: "Develop login page",
            description: "Implement authentication flow",
            lastMainCategory: "inprogress",
            assignedTo: "Charlie",
          },
        ],
        canDelete: false,
      },
      done: {
        name: "Done",
        items: [
          {
            id: "task-4",
            title: "Setup database",
            description: "Initialize schema and tables",
            lastMainCategory: "done",
            assignedTo: "Alice",
          },
        ],
        canDelete: false,
      },
    };

    setColumns(dummyResponse);
    setIsLoading(false);
    setError(null);
  }, []);

  // to handle error messages
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const onDragEnd = (result) => {
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

    // restrict moving
    if (movedItem.lastMainCategory === "inprogress" && destColId === "todo") {
      setError(
        "Cannot move item as it is in progress and cannot be moved back to To Do."
      );
      return;
    }
    if (movedItem.lastMainCategory === "done" && destColId !== "done") {
      setError("Cannot move item as it is done");
      return;
    }

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
    } catch (error) {
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

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      setError("Category name cannot be empty.");
      return;
    }
    try {
      // Call API to add new category
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

  const handleDeleteCategory = (id) => {
    if (columns[id].items.length > 0) {
      setError("Cannot delete category with tasks in it.");
      return;
    }
    try {
      // Call API to delete category
    } catch (error) {
      setError("Failed to delete category. Please try again.");
      console.error("Error deleting category:", error);
      return;
    }
    const updated = { ...columns };
    delete updated[id];
    setColumns(updated);
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      setError("Task title cannot be empty.");
      return;
    }
    if (!newTask.columnId) {
      setError("Please select a category for the task.");
      return;
    }
    if (!newTask.assignedTo) {
      setError("Please assign the task to an employee.");
      return;
    }
    if (!columns[newTask.columnId]) {
      setError("Invalid category selected for the task.");
      return;
    }

    try {
      // Call API to add new task
    } catch (error) {
      setError("Failed to add task. Please try again.");
      console.error("Error adding task:", error);
      return;
    }

    const task = {
      id: uuidv4(),
      title: newTask.title,
      description: newTask.description,
      assignedTo: newTask.assignedTo,
      lastMainCategory: newTask.columnId,
    };

    setColumns({
      ...columns,
      [newTask.columnId]: {
        ...columns[newTask.columnId],
        items: [...columns[newTask.columnId].items, task],
      },
    });

    setNewTask({
      title: "",
      description: "",
      columnId: "todo",
      assignedTo: "",
    });
  };

  const handleDeleteTask = (colId, taskId) => {
    try {
      // Call API to delete task
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

      <h1 className="text-2xl font-bold mb-4">Kanban Board</h1>

      <Link to="/manage-employees">
        <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
          Manage Employees <ArrowRight className="inline ml-1" />
        </button>
      </Link>

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
            <option key={emp.id} value={emp.name}>
              {emp.name}
            </option>
          ))}
        </select>

        <select
          value={newTask.columnId}
          onChange={(e) => setNewTask({ ...newTask, columnId: e.target.value })}
          className="border p-2 rounded"
        >
          {Object.entries(columns).map(([id, col]) => (
            <option key={id} value={id}>
              {col.name}
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
                    onClick={() => handleDeleteCategory(columnId)}
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
