# Task Management Application

A full-stack task management web application built with **React + Vite**, **Node.js + Express**, **MongoDB + Mongoose**, **JWT authentication**, and optional **Socket.IO real-time updates**.

## Features

- User registration and login
- JWT-based authentication and authorization
- Protected task APIs
- Create, read, update, and delete tasks
- Task status: To Do, In Progress, Completed
- Priority: Low, Medium, High
- Search and status filtering
- Dashboard statistics
- Responsive desktop/mobile UI
- Real-time task refresh with Socket.IO
- Password hashing with bcrypt
- MongoDB persistence
- Clean separation of frontend/backend

## Project Structure

```text
task-management-application/
├── client/                 # React frontend
├── server/                 # Express backend
├── docker-compose.yml      # Optional MongoDB container
├── .gitignore
└── README.md
```

## Requirements

- Node.js 18+
- npm
- MongoDB (local or MongoDB Atlas)

## 1. Start MongoDB

### Option A — Docker

```bash
docker compose up -d
```

### Option B — Local MongoDB

Make sure MongoDB is running locally on:

```text
mongodb://127.0.0.1:27017/task_manager
```

## 2. Start the backend

```bash
cd server
npm install
copy .env.example .env
npm run dev
```

On macOS/Linux, use:

```bash
cp .env.example .env
```

Backend runs at:

```text
http://localhost:5000
```

## 3. Start the frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

## Environment Variables

### server/.env

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/task_manager
JWT_SECRET=change_this_to_a_long_random_secret
CLIENT_URL=http://localhost:5173
```

## API Endpoints

### Authentication

| Method | Endpoint | Auth |
|---|---|---|
| POST | `/api/auth/register` | No |
| POST | `/api/auth/login` | No |
| GET | `/api/auth/me` | Yes |

### Tasks

| Method | Endpoint | Auth |
|---|---|---|
| GET | `/api/tasks` | Yes |
| POST | `/api/tasks` | Yes |
| GET | `/api/tasks/:id` | Yes |
| PUT | `/api/tasks/:id` | Yes |
| DELETE | `/api/tasks/:id` | Yes |

## Demo Flow

1. Register a new account.
2. Log in.
3. Create tasks with title, description, priority and due date.
4. Edit task details.
5. Change status.
6. Search/filter tasks.
7. Delete completed or unwanted tasks.
8. Open the application in another browser tab to see real-time task refresh events.

## Submission Notes

This project is intentionally organized as a complete full-stack assignment rather than a single-file demo. The optional real-time feature is implemented using Socket.IO. The backend remains usable even if the Socket.IO connection is unavailable.
