# 🗂️ Kanban Board - Task Management System

A full-stack Kanban Board application for managing tasks and workflows using drag-and-drop. It supports **Admin and Employee roles**, category management, and JWT-based authentication.

---

## ✨ Features

### 🔐 Role-based Access
- **Admin**
  - Add / Delete categories (columns)
  - Create / Assign / Delete tasks
  - View task logs
- **Employee**
  - View assigned tasks
  - Move tasks between allowed statuses
  - Cannot delete or modify others' data

### 🧩 Task Workflow
- Supports `To Do`, `In Progress`, `Done`, and custom categories
- Drag and drop tasks using `@hello-pangea/dnd`
- Movement restrictions:
  - 🚫 No In Progress → To Do
  - 🚫 No movement out of Done

### 📦 Tech Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | React, Tailwind CSS, React Router, @hello-pangea/dnd |
| Backend    | ASP.NET Core Web API (C#), Entity Framework Core 8 |
| Auth       | JWT Tokens, Role-based Auth |
| Database   | SQL Server (EF Core compatible) |

