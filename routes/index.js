const { Router } = require("express");
const router = Router();
const UserRoutes = require("./UserRoutes");
const TasksRoutes = require("./TasksRoutes");

router.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Site Working ...",
    error: null,
  });
});

// User Route
router.use("/user", UserRoutes);
// Tasks Routes
router.use("/tasks", TasksRoutes);

module.exports = router;
