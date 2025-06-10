import React from "react";
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

const initialState = [
  {
    taskId: 1,
    taskName: "task1",
    fromCategory: "Todo",
    toCategory: "In Progress",
    movedBy: "admin",
    movedAt: "2023-10-01T12:00:00Z",
  },
  {
    taskId: 1,
    taskName: "task1",
    fromCategory: "In Progress",
    toCategory: "Done",
    movedBy: "user1",
    movedAt: "2023-10-02T14:30:00Z",
  },
  {
    taskId: 1,
    taskName: "task1",
    fromCategory: "Done",
    toCategory: "Archived",
    movedBy: "admin",
    movedAt: "2023-10-03T16:45:00Z",
  },
  {
    taskId: 2,
    taskName: "task2",
    fromCategory: "Todo",
    toCategory: "In Progress",
    movedBy: "user2",
    movedAt: "2023-10-04T10:15:00Z",
  },
  {
    taskId: 2,
    taskName: "task2",
    fromCategory: "In Progress",
    toCategory: "Done",
    movedBy: "admin",
    movedAt: "2023-10-05T11:20:00Z",
  },
];

function AllLogs() {
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
            {initialState.map((log, index) => (
              <TableRow key={index} hover>
                <TableCell>{log.taskName}</TableCell>
                <TableCell>{log.fromCategory}</TableCell>
                <TableCell>{log.toCategory}</TableCell>
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
