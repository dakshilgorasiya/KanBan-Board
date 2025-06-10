import { useState } from "react";
import "./App.css";
import {
  Login,
  AddEmployee,
  KanbanBoardAdmin,
  KanbanBoardEmployee,
  TaskLogs,
  AllLogs,
} from "./pages";
import { useSelector } from "react-redux";

function App() {
  const isAdmin = useSelector((state) => state.auth.isAdmin);

  if (isAdmin == true) {
    return (
      <>
        <KanbanBoardAdmin />
      </>
    );
  } else {
    return (
      <>
        <KanbanBoardEmployee />
      </>
    );
  }
}

export default App;
