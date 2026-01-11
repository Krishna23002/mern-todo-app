const Todo = require("../models/Todo");

// GET all todos
exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({user: req.userId});
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE todo
exports.createTodo = async (req, res) => {
  try {
    const todo = new Todo({
      title: req.body.title,
      user: req.userId,
    });

    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE todo
exports.deleteTodo = async (req, res) => {
  try {
    await Todo.findByIdAndDelete({ _id: req.params.id, user: req.userId });
    res.json({ message: "Todo deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE todo
exports.updateTodo = async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      {_id: req.params.id, user: req.userId},
      {
      title: req.body.title,
      completed: req.body.completed,
    },
      { new: true }
    );
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.clearTodos = async (req, res) => {
  try {
    await Todo.deleteMany({ user: req.userId });
    res.json({ message: "All todos cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

