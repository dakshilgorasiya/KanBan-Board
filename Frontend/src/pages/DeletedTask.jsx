import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

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
  const [tasks] = useState(initialState);
  const navigate = useNavigate();

  return (
    <div className="p-2">
      <TableContainer
        component={Paper}
        elevation={3}
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          borderRadius: 2, // rounded corners
          overflow: "hidden", // clips children to border
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ height: 56 }}>
              <TableCell sx={{ borderBottom: "none", py: 2 }}>
                <strong>ID</strong>
              </TableCell>
              <TableCell sx={{ borderBottom: "none", py: 2 }}>
                <strong>Name</strong>
              </TableCell>
              <TableCell sx={{ borderBottom: "none", py: 2 }}>
                <strong>Description</strong>
              </TableCell>
              <TableCell sx={{ borderBottom: "none", py: 2 }}>
                <strong>Logs</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id} hover sx={{ height: 56 }}>
                <TableCell sx={{ borderBottom: "none", py: 2 }}>
                  {task.id}
                </TableCell>
                <TableCell sx={{ borderBottom: "none", py: 2 }}>
                  {task.name}
                </TableCell>
                <TableCell sx={{ borderBottom: "none", py: 2 }}>
                  {task.description}
                </TableCell>
                <TableCell sx={{ borderBottom: "none", py: 2 }}>
                  <button
                    className="bg-white/70 hover:cursor-pointer text-black p-2 pl-5 rounded-xl hover:bg-gray-200 transition-colors"
                    onClick={() => navigate(`/task-logs/${task.id}`)}
                  >
                    View
                    <ArrowRight className="inline ml-2" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default DeletedTask;
