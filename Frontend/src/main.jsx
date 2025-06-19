import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import store from "./store/store.js";
import { Provider } from "react-redux";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Layout from "./Layout.jsx";
import {
  Login,
  AddEmployee,
  KanbanBoardAdmin,
  KanbanBoardEmployee,
  ManageEmployee,
  TaskLogs,
  DeletedTask,
} from "./pages";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="" element={<Layout />}>
      <Route path="" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/add-employee" element={<AddEmployee />} />
      <Route path="/kanban-board-admin" element={<KanbanBoardAdmin />} />
      <Route path="/kanban-board-employee" element={<KanbanBoardEmployee />} />
      <Route path="/manage-employees" element={<ManageEmployee />} />
      <Route path="/task-logs/:taskId" element={<TaskLogs />} />
      <Route path="/deletedTask" element={<DeletedTask />} />
      <Route
        path="*"
        element={
          <div className="flex items-center justify-center h-screen">
            <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
          </div>
        }
      />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
