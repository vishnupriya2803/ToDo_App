const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", userSchema);


const taskSchema = new mongoose.Schema({
  text: String,
  completed: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
});

const Task = mongoose.model("Task", taskSchema);


const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, "secretkey");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};


mongoose
  .connect("mongodb://127.0.0.1:27017/Task")
  .then(() => console.log(" Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));


app.get("/", (req, res) => {
  res.send(" Task Manager API with Auth is running");
});

app.post("/register", async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    const newUser = new User({ fullName, email, password });
    await newUser.save();

    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, "secretkey", { expiresIn: "1h" });

    res.json({
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
});


app.post("/submit", auth, async (req, res) => {
  const { text, completed = false } = req.body;
  try {
    const newTask = new Task({ text, completed, userId: req.user.id });
    const savedTask = await newTask.save();
    res.json(savedTask);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/tasks", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
});


app.patch("/tasks/:id/toggle", auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ error: "Task not found" });

    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Unable to toggle task" });
  }
});


app.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.sendStatus(204);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Unable to delete task" });
  }
});


app.listen(5000, () => {
  console.log(` Server running on 5000`);
});