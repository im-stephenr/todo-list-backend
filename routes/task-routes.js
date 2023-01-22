const express = require("express");
const router = express.Router();
const tasksController = require("../controller/tasks-controller");
const { check } = require("express-validator");

// get all task
router.get("/:uid", tasksController.getAllTask);
// add task
router.post("/add", tasksController.addTask);
// update task status
router.patch("/:task_id", tasksController.updateTaskStatus);
// delete task
router.delete("/:task_id", tasksController.deleteTask);

module.exports = router;
