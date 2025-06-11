import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import axios from "axios";
import { BACKEND_URL } from "../Constant";

const initialState = [
  {
    taskId: 1,
    taskName: "task1",
    fromCategory: "Todo",
    toCategory: "In Progress",
    movedBy: "admin",
    movedAt: "2023-10-01T12:00:00Z",
  },
];

function AllLogs() {
  const [logs, setLogs] = useState(initialState);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios
          .get(`${BACKEND_URL}/Log/GetAllLogs`)
          .then((res) => res.data);
        console.log("Fetched logs:", response.data.taskLogs);
        setLogs(response.data.taskLogs);
      } catch (error) {
        console.error("Error fetching task logs:", error);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="p-6">
      <Typography variant="h4" gutterBottom>
        All Task Logs
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Task Id</strong>
              </TableCell>
              <TableCell>
                <strong>Task Name</strong>
              </TableCell>
              <TableCell>
                <strong>Moved From</strong>
              </TableCell>
              <TableCell>
                <strong>Moved To</strong>
              </TableCell>
              <TableCell>
                <strong>Moved By</strong>
              </TableCell>
              <TableCell>
                <strong>Moved At</strong>
              </TableCell>
              <TableCell>
                <strong>View</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log, index) => (
              <TableRow key={index} hover>
                <TableCell>{log.taskId}</TableCell>
                <TableCell>{log.taskName}</TableCell>
                <TableCell>{log.movedFrom}</TableCell>
                <TableCell>{log.movedTo}</TableCell>
                <TableCell>{log.movedBy}</TableCell>
                <TableCell>{new Date(log.movedAt).toLocaleString()}</TableCell>
                <TableCell>
                  <Button
                    component={Link}
                    to={`/task-logs/${log.taskId}`}
                    variant="outlined"
                    size="small"
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default AllLogs;
