const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
  clearTodos,
} = require("../controllers/todoControllers");

router.use(authMiddleware); // 🔐 protect all below routes

router.get("/", getTodos);
router.post("/", createTodo);
router.delete("/", clearTodos);
router.delete("/:id", deleteTodo);
router.put("/:id", updateTodo);

module.exports = router;
