const express = require("express");
const router = express.Router();

const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");


// ========================
// GET TASKS
// ========================

router.get(
  "/",
  authMiddleware,
  async (req, res) => {

    try {

      let tasks;

      if (req.user.role === "admin") {

       tasks = await Task.find()
     .populate("assignedTo", "email name");

      } else {

        tasks = await Task.find({
         assignedTo: req.user.id
     })
    .populate("assignedTo", "email name");

      }

      res.json(tasks);

    } catch (error) {

      res.status(500).json({
        error: error.message
      });

    }

  }
);


// ========================
// CREATE TASK (Admin only)
// ========================

router.post(
  "/create",
  authMiddleware,
  async (req, res) => {

    try {

      if (req.user.role !== "admin") {
        return res.status(403).json({
          message: "Only admin can create tasks"
        });
      }

      const {
        title,
        description,
        assignedTo
      } = req.body;

      const task = new Task({

        title,
        description,

        status: "pending",

        assignedTo

      });

      await task.save();

      res.json(task);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        error: error.message
      });

    }

  }
);
// ========================
// UPDATE TASK STATUS
// ========================

router.put("/update/:id", authMiddleware, async (req, res) => {

  try {

    const { status } = req.body;

    const task =
      await Task.findByIdAndUpdate(

        req.params.id,
        { status },
        { new: true }

      );

    res.json({

      message: "Task updated successfully",
      task

    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});


// ========================
// DELETE TASK (Admin only)
// ========================

router.delete("/delete/:id", authMiddleware, async (req, res) => {

  try {

    // Only admin can delete
    if (req.user.role !== "admin") {

      return res.status(403).json({
        message: "Only admin can delete tasks"
      });

    }

    const task =
      await Task.findByIdAndDelete(
        req.params.id
      );

    if (!task) {

      return res.status(404).json({
        message: "Task not found"
      });

    }

    res.json({

      message: "Task deleted successfully"

    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});

router.put(
  "/edit/:id",
  authMiddleware,
  async (req, res) => {

    try {

      // Only admin can edit
      if (req.user.role !== "admin") {

        return res.status(403).json({
          message: "Only admin can edit tasks"
        });

      }

      const {
        title,
        description
      } = req.body;

      const task =
        await Task.findByIdAndUpdate(

          req.params.id,

          {
            title,
            description
          },

          {
            new: true
          }

        );

      res.json(task);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        error: error.message
      });

    }

  }
);

module.exports = router;