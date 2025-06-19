import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../Constant";

function TaskLogs() {
  const [taskData, setTaskData] = useState({
    taskName: "",
    currentCategory: "",
    history: [],
  });

  const { taskId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
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

      const dummyData = {
        taskName: "task1",
        currentCategory: "category1",
        history: [
          {
            MovedBy: "admin",
            MovedFrom: "Todo",
            MovedTo: "In Progress",
            MovedAt: "2023-10-01T12:00:00Z",
          },
        ],
      };
      setTaskData(tempData);
    };

    fetchData();
  }, []);

  const { taskName, currentCategory, history } = taskData;

  return (
    <div className="">
      <Box p={4}>
        <Typography variant="h4" gutterBottom>
          Task Logs
        </Typography>

        <Box mb={3}>
          <Typography variant="subtitle1">
            <strong>Task Name:</strong> {taskName}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Current Category:</strong> {currentCategory}
          </Typography>
        </Box>

        <TableContainer
          component={Paper}
          elevation={3}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            borderRadius: 2, // rounded corners
            overflow: "hidden", // clips children to border radius
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow sx={{ height: 56 }}>
                <TableCell sx={{ borderBottom: "none", py: 2 }}>
                  <strong>Moved By</strong>
                </TableCell>
                <TableCell sx={{ borderBottom: "none", py: 2 }}>
                  <strong>From</strong>
                </TableCell>
                <TableCell sx={{ borderBottom: "none", py: 2 }}>
                  <strong>To</strong>
                </TableCell>
                <TableCell sx={{ borderBottom: "none", py: 2 }}>
                  <strong>At</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((log, index) => (
                <TableRow key={index} hover sx={{ height: 56 }}>
                  <TableCell sx={{ borderBottom: "none", py: 2 }}>
                    {log.movedBy}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none", py: 2 }}>
                    {log.from}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none", py: 2 }}>
                    {log.to}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none", py: 2 }}>
                    {new Date(log.at).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
}

export default TaskLogs;
