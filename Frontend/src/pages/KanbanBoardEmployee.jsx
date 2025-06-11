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
    // console.log(destCol.name);
    // update the lastMainCategory of the moved item
    if (destCol.name === "Todo") {
      movedItem.lastMainCategory = "Todo";
    } else if (destCol.name === "In Progress") {
      movedItem.lastMainCategory = "In Progress";
    } else if (destCol.name === "Done") {
      movedItem.lastMainCategory = "Done";
    }

    console.log("Moved Item:", movedItem);

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

export default KanbanBoardEmployee;
