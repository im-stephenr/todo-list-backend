const Task = require("../model/task-model");
const User = require("../model/user-model");
const HttpError = require("../model/http-error");
const { validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");

const getAllTask = async (req, res, next) => {
  const { uid } = req.params;
  try {
    const tasks = await Task.find({ author: uid }).populate(
      "author",
      "-password"
    );
    res.json(tasks);
  } catch (err) {
    console.log(err);
  }
};

const addTask = async (req, res, next) => {
  const { author } = req.body;
  const newTask = new Task({ ...req.body, author: author });

  const user = await User.findById(author);

  if (!user) {
    return next(new HttpError("Could not find user", 404));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await newTask.save({ session: sess });
    user.todos.push(newTask);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    return next(new HttpError("Creating task failed", 404));
  }

  res.json(newTask);
};

const updateTaskStatus = async (req, res, next) => {
  const { task_id } = req.params;
  try {
    const updateStatus = await Task.findByIdAndUpdate(task_id, {
      status: req.body.status,
    });
    res.json(updateStatus);
  } catch (err) {
    console.log(err);
    return next(new HttpError("Could not update task status", 404));
  }
};

const deleteTask = async (req, res, next) => {
  const { task_id } = req.params;
  try {
    const deleteTask = await Task.findByIdAndDelete(task_id);
    res.json({ deleteTask });
  } catch (err) {
    console.log(err);
    return next(new HttpError("Could not delete task", 404));
  }
};

exports.getAllTask = getAllTask;
exports.addTask = addTask;
exports.updateTaskStatus = updateTaskStatus;
exports.deleteTask = deleteTask;
