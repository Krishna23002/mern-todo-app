import { useEffect, useState } from "react";
import axios from "axios";

const Todo = ({ token, setToken }) => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    axios.get("https://mern-todo-app-1-zxn7.onrender.com/todos", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => setTodos(res.data));
  }, [token]);

  const addTodo = () => {
    axios.post(
      "https://mern-todo-app-1-zxn7.onrender.com/todos",
      { title },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((res) => {
      setTodos([...todos, res.data]);
      setTitle("");
    });
  };

  const deleteTodo = (id) => {
    axios.delete(`https://mern-todo-app-1-zxn7.onrender.com/todos/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => {
      setTodos(todos.filter((todo) => todo._id !== id));
    });
  };

  const toggleTodo = (id, completed) => {
    axios.put(
      `https://mern-todo-app-1-zxn7.onrender.com/todos/${id}`,
      { completed: !completed },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((res) => {
      setTodos(
        todos.map((todo) =>
          todo._id === id ? res.data : todo
        )
      );
    });
  };

  const startEdit = (todo) => {
    setEditId(todo._id);
    setEditTitle(todo.title);
  };

  const saveEdit = (id) => {
    axios
      .put(
        `https://mern-todo-app-1-zxn7.onrender.com/todos/${id}`,
        { title: editTitle },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setTodos(
          todos.map((todo) =>
            todo._id === id ? res.data : todo
          )
        );
        setEditId(null);
      })
      .catch((err) => console.error(err));
  };

  const clearAllTodos = () => {
    axios
      .delete("https://mern-todo-app-1-zxn7.onrender.com/todos", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        setTodos([]); // instantly clear UI
      })
      .catch((err) => console.error(err));
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    localStorage.setItem("theme", !isDark ? "dark" : "light");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  return (
    <div className={`container ${isDark ? "dark" : ""}`}>
      <h1>Todo App</h1>
      <button onClick={logout} className="logoutButton">Logout</button>
      <button className="clear-btn" onClick={clearAllTodos}>
        Clear All
      </button>
      <button className="theme-btn" onClick={toggleTheme}>
        {isDark ? "Light Mode" : "Dark Mode"}
      </button>



      <div className="input-box">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter todo"
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo._id} className="todo-item">
            <div className="left">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo._id, todo.completed)}
              />

              {editId === todo._id ? (
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="edit-input"
                />
              ) : (
                <span
                  className={todo.completed ? "completed" : ""}
                >
                  {todo.title}
                </span>
              )}
            </div>

            <div className="right">
              {editId === todo._id ? (
                <button onClick={() => saveEdit(todo._id)}>💾</button>
              ) : (
                <button onClick={() => startEdit(todo)}>✏️</button>
              )}

              <button onClick={() => deleteTodo(todo._id)}>❌</button>
            </div>
          </li>
        ))}
      </ul>

    </div>
  );
};

export default Todo;
