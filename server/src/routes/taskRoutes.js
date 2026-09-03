import express from "express";
import mongoose from "mongoose";
import Task from "../models/Task.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

function validateObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function emitChange(req, event, payload) {
  const io = req.app.get("io");
  if (io) io.emit(event, payload);
}

router.get("/", async (req, res, next) => {
  try {
    const { search = "", status = "all" } = req.query;
    const filter = { user: req.userId };

    if (status !== "all") filter.status = status;

    if (search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } }
      ];
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json({ tasks });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ task });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: "Task title is required" });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description?.trim() || "",
      status: status || "todo",
      priority: priority || "medium",
      dueDate: dueDate || null,
      user: req.userId
    });

    emitChange(req, "tasks:changed", { action: "created", task });
    res.status(201).json({ task });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const allowed = ["title", "description", "status", "priority", "dueDate"];
    const updates = {};

    for (const key of allowed) {
      if (key in req.body) updates[key] = req.body[key];
    }

    if ("title" in updates) {
      if (!updates.title?.trim()) {
        return res.status(400).json({ message: "Task title is required" });
      }
      updates.title = updates.title.trim();
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found" });

    emitChange(req, "tasks:changed", { action: "updated", task });
    res.json({ task });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    emitChange(req, "tasks:changed", { action: "deleted", taskId: task._id });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;
