import { useEffect, useMemo, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import {
  CheckCircle2,
  Circle,
  Clock3,
  ListTodo,
  LogOut,
  Plus,
  Search,
  Trash2,
  X,
  Pencil,
  Filter
} from "lucide-react";
import api from "./api.js";

const emptyForm = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  dueDate: ""
};

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("taskflow_user");
    return saved ? JSON.parse(saved) : null;
  });

  function handleAuth(data) {
    localStorage.setItem("taskflow_token", data.token);
    localStorage.setItem("taskflow_user", JSON.stringify(data.user));
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("taskflow_token");
    localStorage.removeItem("taskflow_user");
    setUser(null);
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <AuthPage mode="login" onAuth={handleAuth} />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/" replace /> : <AuthPage mode="register" onAuth={handleAuth} />}
      />
      <Route
        path="/"
        element={user ? <Dashboard user={user} onLogout={logout} /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}

function AuthPage({ mode, onAuth }) {
  const navigate = useNavigate();
  const isRegister = mode === "register";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const response = await api.post(endpoint, form);
      onAuth(response.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="brand-mark">TF</div>
        <p className="eyebrow">TASKFLOW</p>
        <h1>{isRegister ? "Create your account" : "Welcome back"}</h1>
        <p className="muted">
          {isRegister
            ? "Organize your work and stay on top of every task."
            : "Sign in to continue managing your tasks."}
        </p>

        {error && <div className="alert">{error}</div>}

        <form onSubmit={submit} className="stack">
          {isRegister && (
            <label>
              Full name
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
              />
            </label>
          )}
          <label>
            Email
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
            />
          </label>
          <label>
            Password
            <input
              required
              minLength="6"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="At least 6 characters"
            />
          </label>
          <button className="primary-button" disabled={loading}>
            {loading ? "Please wait..." : isRegister ? "Create account" : "Sign in"}
          </button>
        </form>

        <button className="link-button" onClick={() => navigate(isRegister ? "/login" : "/register")}>
          {isRegister ? "Already have an account? Sign in" : "New here? Create an account"}
        </button>
      </section>
    </main>
  );
}

function Dashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  async function loadTasks() {
    try {
      setLoading(true);
      const response = await api.get("/tasks", {
        params: { search, status }
      });
      setTasks(response.data.tasks);
    } catch (err) {
      if (err.response?.status === 401) onLogout();
      else showToast(err.response?.data?.message || "Could not load tasks");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, [search, status]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000");
    socket.on("tasks:changed", () => loadTasks());
    return () => socket.disconnect();
  }, [search, status]);

  function showToast(message) {
    setToast(message);
    window.clearTimeout(window.__taskflowToast);
    window.__taskflowToast = window.setTimeout(() => setToast(""), 2800);
  }

  async function saveTask(form) {
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, form);
        showToast("Task updated");
      } else {
        await api.post("/tasks", form);
        showToast("Task created");
      }
      setModalOpen(false);
      setEditingTask(null);
      loadTasks();
    } catch (err) {
      throw new Error(err.response?.data?.message || "Could not save task");
    }
  }

  async function deleteTask(id) {
    if (!window.confirm("Delete this task?")) return;

    try {
      await api.delete(`/tasks/${id}`);
      showToast("Task deleted");
      loadTasks();
    } catch (err) {
      showToast(err.response?.data?.message || "Could not delete task");
    }
  }

  async function updateStatus(task, nextStatus) {
    try {
      await api.put(`/tasks/${task._id}`, { status: nextStatus });
      loadTasks();
    } catch (err) {
      showToast(err.response?.data?.message || "Could not update task");
    }
  }

  const stats = useMemo(() => ({
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    progress: tasks.filter((t) => t.status === "in-progress").length,
    completed: tasks.filter((t) => t.status === "completed").length
  }), [tasks]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="logo">TaskFlow</div>
          <div className="user-area">
            <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
            <div className="user-copy">
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>
            <button className="icon-button" title="Logout" onClick={onLogout}>
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard">
        <section className="hero">
          <div>
            <p className="eyebrow">PERSONAL WORKSPACE</p>
            <h1>Good to see you, {user.name.split(" ")[0]}.</h1>
            <p className="muted">Plan, prioritize and finish your work.</p>
          </div>
          <button
            className="primary-button add-button"
            onClick={() => {
              setEditingTask(null);
              setModalOpen(true);
            }}
          >
            <Plus size={19} /> New task
          </button>
        </section>

        <section className="stats-grid">
          <StatCard icon={<ListTodo />} label="Total" value={stats.total} />
          <StatCard icon={<Circle />} label="To Do" value={stats.todo} />
          <StatCard icon={<Clock3 />} label="In Progress" value={stats.progress} />
          <StatCard icon={<CheckCircle2 />} label="Completed" value={stats.completed} />
        </section>

        <section className="toolbar">
          <div className="search-box">
            <Search size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
            />
          </div>
          <div className="filter-box">
            <Filter size={17} />
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">All statuses</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </section>

        {loading ? (
          <div className="empty-state">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <ListTodo size={40} />
            <h3>No tasks found</h3>
            <p>Create a task or change your filters.</p>
          </div>
        ) : (
          <section className="task-grid">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={() => {
                  setEditingTask(task);
                  setModalOpen(true);
                }}
                onDelete={() => deleteTask(task._id)}
                onStatusChange={(next) => updateStatus(task, next)}
              />
            ))}
          </section>
        )}
      </main>

      {modalOpen && (
        <TaskModal
          initial={editingTask || emptyForm}
          onClose={() => {
            setModalOpen(false);
            setEditingTask(null);
          }}
          onSave={saveTask}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const nextStatus =
    task.status === "todo"
      ? "in-progress"
      : task.status === "in-progress"
        ? "completed"
        : "todo";

  return (
    <article className="task-card">
      <div className="task-top">
        <span className={`badge ${task.priority}`}>{task.priority}</span>
        <div className="card-actions">
          <button className="icon-button" title="Edit task" onClick={onEdit}><Pencil size={16} /></button>
          <button className="icon-button danger" title="Delete task" onClick={onDelete}><Trash2 size={16} /></button>
        </div>
      </div>

      <h3>{task.title}</h3>
      <p className="task-description">{task.description || "No description added."}</p>

      <div className="task-footer">
        <select
          className={`status-select ${task.status}`}
          value={task.status}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        {task.dueDate ? (
          <span className="due-date">
            Due {new Date(task.dueDate).toLocaleDateString()}
          </span>
        ) : (
          <span className="due-date">No due date</span>
        )}
      </div>
    </article>
  );
}

function TaskModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState({
    title: initial.title || "",
    description: initial.description || "",
    status: initial.status || "todo",
    priority: initial.priority || "medium",
    dueDate: initial.dueDate ? new Date(initial.dueDate).toISOString().slice(0, 10) : ""
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("Task title is required.");
      return;
    }

    try {
      setSaving(true);
      await onSave({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        dueDate: form.dueDate || null
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <p className="eyebrow">{initial._id ? "EDIT TASK" : "NEW TASK"}</p>
            <h2>{initial._id ? "Update task" : "Create task"}</h2>
          </div>
          <button className="icon-button" onClick={onClose}><X /></button>
        </div>

        {error && <div className="alert">{error}</div>}

        <form onSubmit={submit} className="stack">
          <label>
            Title
            <input
              autoFocus
              required
              maxLength="120"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Complete project documentation"
            />
          </label>

          <label>
            Description
            <textarea
              rows="4"
              maxLength="1000"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Add useful details..."
            />
          </label>

          <div className="form-grid">
            <label>
              Status
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </label>
            <label>
              Priority
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
          </div>

          <label>
            Due date
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
          </label>

          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
            <button className="primary-button" disabled={saving}>
              {saving ? "Saving..." : initial._id ? "Save changes" : "Create task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
