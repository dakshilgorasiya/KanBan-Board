import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { ArrowRight, AlertTriangle, X } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../Constant.js";

const initialColumns = {
  todo: {
    name: "To Do",
    items: [],
  },
  inprogress: {
    name: "In Progress",
    items: [],
  },
  done: {
    name: "Done",
    items: [],
  },
};

function KanbanBoardEmployee() {
  const navigate = useNavigate();

  // to store data
  const [columns, setColumns] = useState(initialColumns);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleClose = () => {
    setError("");
  };

  // to get task data from api
  useEffect(() => {
    // call api to get tasks
    const fetchTasks = async () => {
      try {
        setIsLoading(true);

        const response = await axios
          .get(`${BACKEND_URL}/Task/Get-AllTask-By-EmployeeID`, {
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
          });
        });

        data.map((category) => {
          if (category.name === "Todo") {
            // console.log("To Do Category:", category);
            category.items.map((task) => {
              task.lastMainCategory = "Todo";
            });
          } else if (category.name === "In Progress") {
            // console.log("In Progress Category:", category);
            category.items.map((task) => {
              task.lastMainCategory = "In Progress";
            });
          } else if (category.name === "Done") {
            // console.log("Done Category:", category);
            category.items.map((task) => {
              task.lastMainCategory = "Done";
            });
          } else {
            category.items.map((task) => {
              task.lastMainCategory = "Todo";
            });
          }
        });

        console.log(data);

        setColumns(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Failed to fetch tasks. Please try again.");
        return;
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn === false) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

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

    // restrict moving

    if (
      movedItem.lastMainCategory === "In Progress" &&
      destCol.name === "Todo"
    ) {
      setError(
        "Cannot move item as it is in progress and cannot be moved back to To Do."
      );
      return;
    }
    if (movedItem.lastMainCategory === "Done" && destCol.name !== "Done") {
      setError("Cannot move item as it is done");
      return;
    }

    if (destCol.name == "In Progress" && destCol.items.length >= 1) {
      setError("Cannot move item to In Progress as it already has a task.");
      return;
    }

    // console.log(destCol.name);
    // update the lastMainCategory of the moved item
    if (destCol.name === "Todo") {
      movedItem.lastMainCategory = "Todo";
    } else if (destCol.name === "In Progress") {
      movedItem.lastMainCategory = "In Progress";
    } else if (destCol.name === "Done") {
      movedItem.lastMainCategory = "Done";
    }

    if (sourceColId !== destColId) {
      try {
        // call api to update the task
        // console.log(movedItem.taskId);
        // console.log(columns[sourceColId].categoryId);
        // console.log(columns[destColId].categoryId);
        const response = await axios.put(
          `${BACKEND_URL}/Task/MoveTask-By-Employee`,
          {
            taskId: movedItem.taskId,
            fromCategoryId: columns[sourceColId].categoryId,
            toCategoryId: columns[destColId].categoryId,
          },
          {
            withCredentials: true,
          }
        );
        console.log("api : " + response);
      } catch (error) {
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
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {column.name}
                  </h2>
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                    {column.items.length}
                  </span>
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

                              {/* Task Content */}
                              <div className="pr-4">
                                <h3 className="font-semibold text-gray-800 mb-2 leading-tight">
                                  {item.title}
                                </h3>
                                <p className="text-sm text-gray-600 line-clamp-3">
                                  {item.description}
                                </p>
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
      </div>
    </div>
  );
}

export default KanbanBoardEmployee;
