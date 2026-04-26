const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes =require("./routes/authRoutes");
const taskRoutes =require("./routes/taskRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

mongoose.connect(
  "mongodb://127.0.0.1:27017/taskmanager"
)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});