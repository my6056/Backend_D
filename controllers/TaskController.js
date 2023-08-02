const TaskModel = require("../models/TaskManagement");
const UserModel = require("../models/UserModel");
const { body, validationResult } = require("express-validator");

// Create a new task

module.exports.CreateTask = async (req, res) => {
  const { title, description, dueDate } = req.body;
  const { userId } = req.params;

  // Use express-validator to define the validation rules
  const validationRules = [
    body("title").notEmpty().withMessage("Title is required!"),
    body("description").notEmpty().withMessage("Description is required!"),
    body("dueDate").notEmpty().withMessage("Due date is required!"),
  ];
  // Check validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({
      success: false,
      errors: errors.array(),
      message: errors.array(),
    });
  }
  try {
    // Check if the user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        message: "User not found.",
        error: "User not found.",
      });
    }
    // Convert the due_date to a Date object if it's a valid date string
    const parsedDueDate = new Date(dueDate);
    if (isNaN(parsedDueDate.getTime())) {
      return res.json({
        success: false,
        message: "Invalid due date format.",
        error: "Invalid due date format.",
      });
    }
    // Create a new task using the TaskModel
    const newTask = new TaskModel({
      title,
      description,
      dueDate: parsedDueDate,
      completed: false,
      user: userId,
    });
    // Save the new task to the database
    const savedTask = await newTask.save();
    // Return the saved task as a response
    return res.json({
      success: true,
      data: savedTask,
      message: "Task Created Successfully",
      error: null,
    });
  } catch (error) {
    return res.json({
      success: false,
      errors: error.message,
      message: "Inernal Server Error !",
    });
  }
};

/* GET THE SPECIFIC TASK*/
module.exports.GetSpecificTask = async (req, res) => {
  const { taskId } = req.params;
  try {
    // Find the task with the specified taskID
    const task = await TaskModel.findById(taskId);
    if (!task) {
      return res.json({
        success: false,
        message: "Task not found",
        error: "Task not found",
      });
    }
    // Return the task object
    return res.json({
      success: true,
      message: "task loaded",
      data: task,
      error: null,
    });
  } catch (error) {
    return res.json({
      success: false,
      errors: error.message,
      message: "Inernal Server Error !",
    });
  }
};

/* GET ALL TASK WITH USER'S ID*/

module.exports.GetAllTask = async (req, res) => {
  // Extract the userId from the request parameters
  const { userId } = req.params;

  try {
    const userTasks = await TaskModel.find({ user: userId }).populate(
      "UserModel"
    );
    if (!userTasks) {
      return res.json({
        success: false,
        message: "No tasks found ",
        error: "No tasks found ",
      });
    }
    if (userTasks.length === 0) {
      return res.json({
        success: true,
        message: "No tasks found for the user.",
        data: [],
        error: null,
      });
    }
    return res.json({
      success: true,
      message: "Tasks retrieved successfully.",
      data: userTasks,
      error: null,
    });
  } catch (error) {
    return res.json({
      success: false,
      errors: error.message,
      message: "Inernal Server Error !",
    });
  }
};

/* UPDATE THE TASK*/

module.exports.UpdateTask = async (req, res) => {
  // Extract the task ID and updated task data from the request body
  const { taskId } = req.params;
  const { title, description, dueDate } = req.body;
  try {
    // Find the task with the provided ID in the database
    const existingTask = await TaskModel.findById(taskId);

    // Check if the task exists
    if (!existingTask) {
      return res.json({
        success: false,
        message: "Task not found.",
        error: "Task not found.",
      });
    }
    // Update the task properties with the provided data
    if (title) {
      existingTask.title = title;
    }

    if (description) {
      existingTask.description = description;
    }

    if (dueDate) {
      // Convert the due_date to a Date object if it's a valid date string
      const parsedDueDate = new Date(dueDate);
      if (isNaN(parsedDueDate.getTime())) {
        return res.json({
          success: false,
          message: "Invalid due date format.",
        });
      } else {
        existingTask.dueDate = parsedDueDate;
        return;
      }
    }
    // Save the updated task to the database
    const updatedTask = await existingTask.save();

    // Return the updated task as a response
    return res.json({
      success: true,
      data: updatedTask,
      message: "Task Updated Successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      errors: error.message,
      message: "Inernal Server Error !",
    });
  }
};

/* DELETE THE TASK*/
module.exports.DeleteTask = async (req, res) => {
  // Extract the task ID from the request parameters
  const { taskId } = req.params;
  try {
    // Find the task with the provided ID in the database
    const existingTask = await TaskModel.findByIdAndDelete(taskId);

    // Check if the task exists
    if (!existingTask) {
      return res.json({ success: false, message: "Task not found." });
    }

    // Return a success message as a response
    return res.json({ success: true, message: "Task deleted successfully." });
  } catch (error) {
    return res.json({
      success: false,
      errors: error.message,
      message: "Inernal Server Error !",
    });
  }
};
