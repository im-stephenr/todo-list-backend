const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const taskSchema = new Schema({
  description: { type: String, required: true },
  author: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  status: { type: Number, required: true, default: 0 },
});

taskSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Tasks", taskSchema);
