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

function TaskLogs() {
  const [taskData, setTaskData] = useState({
    taskName: "",
    currentCategory: "",
    history: [],
  });

  const { taskId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      // TODO: CALL API TO FETCH TASK LOGS
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
          {
            MovedBy: "user1",
            MovedFrom: "In Progress",
            MovedTo: "Done",
            MovedAt: "2023-10-02T14:30:00Z",
          },
          {
            MovedBy: "admin",
            MovedFrom: "Done",
            MovedTo: "Archived",
            MovedAt: "2023-10-03T16:45:00Z",
          },
          {
            MovedBy: "user2",
            MovedFrom: "Todo",
            MovedTo: "In Progress",
            MovedAt: "2023-10-04T10:15:00Z",
          },
          {
            MovedBy: "admin",
            MovedFrom: "In Progress",
            MovedTo: "Done",
            MovedAt: "2023-10-05T11:20:00Z",
          },
        ],
      };
      setTaskData(dummyData);
    };

    fetchData();
  }, []);

  const { taskName, currentCategory, history } = taskData;

  return (
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

      <TableContainer component={Paper} elevation={3}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Moved By</strong>
              </TableCell>
              <TableCell>
                <strong>From</strong>
              </TableCell>
              <TableCell>
                <strong>To</strong>
              </TableCell>
              <TableCell>
                <strong>At</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((log, index) => (
              <TableRow key={index} hover>
                <TableCell>{log.MovedBy}</TableCell>
                <TableCell>{log.MovedFrom}</TableCell>
                <TableCell>{log.MovedTo}</TableCell>
                <TableCell>{new Date(log.MovedAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default TaskLogs;
