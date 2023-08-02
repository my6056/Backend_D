const { Schema, model } = require("mongoose");

// Create a task schema
const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "UserModel",
    require: true,
  },
});

// export task model based on the schema
module.exports = model("TaskModel", taskSchema);
