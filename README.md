# 🚀 Task Management Application

A modern **full-stack Task Management Application** built to help users create, organize, track, and manage tasks efficiently. The application includes secure JWT authentication, task CRUD operations, filtering, dashboard statistics, MongoDB persistence, and optional real-time updates using Socket.IO.

### 🌐 Live Demo

👉 **[View the Live Application](https://task-management-application-client-seven.vercel.app/)**

---

## ✨ Features

### 🔐 Authentication & Security

* User registration and login
* JWT-based authentication
* Protected API routes
* Password hashing using bcrypt
* User-specific task access
* Secure authorization middleware

### 📋 Task Management

* Create new tasks
* View all personal tasks
* View individual task details
* Edit existing tasks
* Delete tasks
* Update task status
* Set task priority
* Add task descriptions
* Set due dates

### 📊 Task Organization

* **To Do**
* **In Progress**
* **Completed**

Priority levels:

* 🟢 Low
* 🟡 Medium
* 🔴 High

### 🔎 Search & Filtering

* Search tasks by title/content
* Filter tasks by status
* Quickly find relevant tasks
* Dynamic task updates

### 📈 Dashboard

* Total tasks
* Pending tasks
* In-progress tasks
* Completed tasks
* Task overview statistics

### ⚡ Real-Time Updates

* Socket.IO integration
* Real-time task refresh events
* Multi-tab task synchronization
* Application continues working even when Socket.IO is unavailable

### 📱 Responsive Design

* Desktop-friendly interface
* Mobile responsive layout
* Clean and intuitive UI
* Component-based React architecture

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose                     |
| ---------- | --------------------------- |
| React.js   | UI development              |
| Vite       | Frontend build tool         |
| JavaScript | Application logic           |
| CSS        | Styling & responsive design |
| Axios      | API communication           |

### Backend

| Technology | Purpose                 |
| ---------- | ----------------------- |
| Node.js    | Runtime environment     |
| Express.js | REST API                |
| MongoDB    | Database                |
| Mongoose   | MongoDB ODM             |
| JWT        | Authentication          |
| bcrypt     | Password hashing        |
| Socket.IO  | Real-time communication |

---

## 🏗️ Project Architecture

```text
                    ┌──────────────────────┐
                    │      React + Vite    │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │   Node.js + Express  │
                    │      Backend         │
                    └──────────┬───────────┘
                               │
                    ┌──────────┴───────────┐
                    │                      │
                    ▼                      ▼
             ┌─────────────┐       ┌─────────────┐
             │   MongoDB   │       │  Socket.IO  │
             │  Database   │       │ Real-Time   │
             └─────────────┘       └─────────────┘
```

---

## 📁 Project Structure

```text
task-management-application/
│
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Make sure you have the following installed:

* Node.js 18+
* npm
* MongoDB

You can use either **local MongoDB** or **MongoDB Atlas**.

---

## 1️⃣ Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd task-management-application
```

---

## 2️⃣ Start MongoDB

### Option A — Docker

If Docker is installed:

```bash
docker compose up -d
```

### Option B — Local MongoDB

Make sure MongoDB is running locally:

```text
mongodb://127.0.0.1:27017/task_manager
```

---

# ⚙️ Backend Setup

Open a terminal:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create the environment file.

### Windows

```bash
copy .env.example .env
```

### macOS/Linux

```bash
cp .env.example .env
```

Configure `.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/task_manager
JWT_SECRET=change_this_to_a_long_random_secret
CLIENT_URL=http://localhost:5173
```

Start the development server:

```bash
npm run dev
```

Backend will run on:

```text
http://localhost:5000
```

---

# 💻 Frontend Setup

Open another terminal:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend will run on:

```text
http://localhost:5173
```

---

# 🔑 Environment Variables

The backend requires the following environment variables:

| Variable     | Description                    |
| ------------ | ------------------------------ |
| `PORT`       | Backend server port            |
| `MONGO_URI`  | MongoDB connection string      |
| `JWT_SECRET` | Secret used to sign JWT tokens |
| `CLIENT_URL` | Frontend URL                   |

> ⚠️ Never commit your `.env` file or expose your `JWT_SECRET`.

---

# 📡 API Documentation

## Authentication APIs

| Method | Endpoint             | Authentication |
| ------ | -------------------- | -------------- |
| `POST` | `/api/auth/register` | ❌              |
| `POST` | `/api/auth/login`    | ❌              |
| `GET`  | `/api/auth/me`       | ✅              |

### Register

```http
POST /api/auth/register
```

Example request:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

---

### Login

```http
POST /api/auth/login
```

Example request:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

---

### Get Current User

```http
GET /api/auth/me
Authorization: Bearer <JWT_TOKEN>
```

---

# 📋 Task APIs

| Method   | Endpoint         | Authentication |
| -------- | ---------------- | -------------- |
| `GET`    | `/api/tasks`     | ✅              |
| `POST`   | `/api/tasks`     | ✅              |
| `GET`    | `/api/tasks/:id` | ✅              |
| `PUT`    | `/api/tasks/:id` | ✅              |
| `DELETE` | `/api/tasks/:id` | ✅              |

---

## Create Task

```http
POST /api/tasks
Authorization: Bearer <JWT_TOKEN>
```

Example:

```json
{
  "title": "Complete MERN Project",
  "description": "Finish the task management application",
  "priority": "High",
  "status": "To Do",
  "dueDate": "2026-09-10"
}
```

---

## Update Task

```http
PUT /api/tasks/:id
Authorization: Bearer <JWT_TOKEN>
```

---

## Delete Task

```http
DELETE /api/tasks/:id
Authorization: Bearer <JWT_TOKEN>
```

---

# 🔄 Application Flow

```text
User
 │
 ▼
Register / Login
 │
 ▼
JWT Authentication
 │
 ▼
Dashboard
 │
 ├── Create Task
 ├── View Tasks
 ├── Search Tasks
 ├── Filter Tasks
 ├── Update Task
 ├── Change Status
 └── Delete Task
 │
 ▼
MongoDB
 │
 ▼
Socket.IO Event
 │
 ▼
Real-Time UI Refresh
```

---

# 🧪 Demo Flow

You can test the application using the following flow:

1. Open the live application.
2. Register a new account.
3. Log in.
4. Create a task.
5. Set its priority and due date.
6. Change the task status.
7. Search for tasks.
8. Filter tasks by status.
9. Edit task details.
10. Delete an unwanted task.
11. Open the application in another browser tab and test real-time task refresh.

---

# 🌐 Live Application

### 🚀 Try the Project

**https://task-management-application-client-seven.vercel.app/**

The application is deployed and available online for demonstration.

---

# 📸 Screenshots

Add your application screenshots here:

```text
screenshots/
├── login.png
├── register.png
├── dashboard.png
├── task-create.png
└── task-management.png
```

Example:

### 🔐 Login

![Login Screenshot](screenshots/login.png)

### 📊 Dashboard

![Dashboard Screenshot](screenshots/dashboard.png)

### 📋 Task Management

![Task Management Screenshot](screenshots/task-management.png)

---

# 🔒 Security

The application implements several security practices:

* JWT-based authentication
* Protected API endpoints
* Password hashing with bcrypt
* User-specific task authorization
* Environment variables for sensitive configuration
* Server-side authentication middleware

---

# ⚡ Real-Time Architecture

Socket.IO is used to provide real-time task refresh functionality.

When a task is created, updated, or deleted:

```text
Client
   │
   ▼
Express API
   │
   ▼
MongoDB
   │
   ▼
Socket.IO Event
   │
   ▼
Connected Clients
   │
   ▼
Task List Refresh
```

The application is designed so that the core task management functionality continues to work even if the Socket.IO connection is unavailable.

---

# 🎯 Key Learning Outcomes

This project demonstrates practical experience with:

* Full-stack web development
* MERN architecture
* REST API development
* JWT authentication
* MongoDB database design
* Mongoose models
* CRUD operations
* React component architecture
* API integration
* Authentication middleware
* Real-time communication
* Responsive UI development
* Environment configuration
* Git & GitHub workflow
* Deployment

---

# 🚀 Future Improvements

Potential improvements include:

* Drag-and-drop task management
* Task categories and tags
* Calendar-based task view
* Email reminders
* Push notifications
* Advanced analytics
* Team collaboration
* Task assignment
* Role-based access control
* Dark/light theme
* File attachments
* Activity history
* Cloud deployment for backend and database

---

# 👨‍💻 Author

**ARJITH S R**

Computer Science Engineering — AI & ML

Interested in:

* Artificial Intelligence
* Machine Learning
* Full-Stack Development
* Generative AI
* Data Structures & Algorithms

---

## ⭐ Support

If you found this project useful, consider giving the repository a ⭐ on GitHub.

**Live Demo:**
👉 https://task-management-application-client-seven.vercel.app/

**Built with ❤️ using React, Node.js, Express, MongoDB and JavaScript.**

