import { useEffect, useState } from "react";
import axios from "axios";

const Todo = ({ token, setToken }) => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [todayLabel, setTodayLabel] = useState("");

  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
  document.title = "Todo App";
}, []);

useEffect(() => {
  if (!token) return; // wait until token exists

  axios.get("https://mern-todo-app-1-zxn7.onrender.com/todos", {
    headers: { Authorization: `Bearer ${token}` },
  })
  .then((res) => setTodos(res.data))
  .catch((err) => console.error(err));
}, [token]);


  useEffect(() => {
  if (!token) {
    window.location.href = "/login";
  }
}, [token]);


  useEffect(() => {
    setTodayLabel(getTodayLabel());

    const interval = setInterval(() => {
      setTodayLabel(getTodayLabel());
    }, 60000); // updates if day changes while app is open

    return () => clearInterval(interval);
  }, []);


 const addTodo = () => {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) return; // prevent empty title

  axios.post(
    "https://mern-todo-app-1-zxn7.onrender.com/todos",
    { title: trimmedTitle }, // only title needed
    { headers: { Authorization: `Bearer ${token}` } }
  )
  .then((res) => {
    setTodos([...todos, res.data]);
    setTitle("");
  })
  .catch(err => {
    console.error("POST /todos error:", err.response?.data || err);
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
          Authorization: `Bearer ${token}`, // use the prop token
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
        Authorization: `Bearer ${token}`, // ✅ use prop instead of localStorage
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
  window.location.href = "/"; // redirect to login/signup
};


  function getTodayLabel() {
    const today = new Date();

    const formatter = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short"
    });

    return formatter.format(today);
  }



  return (
    <div className="todo-page">
    <div className={`todo-container ${isDark ? "dark" : ""}`}>
      <div className="header">
        <h1>Todo App</h1>
        <span className="date-label">{todayLabel}</span>
      </div>

      <div className="top-buttons">
        <button className="clear-btn" onClick={clearAllTodos}>
          Clear All
        </button>
        <button className="theme-btn" onClick={toggleTheme}>
          {isDark ? "Light Mode" : "Dark Mode"}
        </button>
        <button onClick={logout} className="logoutButton">Logout</button>
      </div>



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
                <button onClick={() => saveEdit(todo._id)}><i class="fa-solid fa-floppy-disk"></i></button>
              ) : (
                <button onClick={() => startEdit(todo)}><i class="fa-solid fa-plus"></i></button>
              )}

              <button onClick={() => deleteTodo(todo._id)}><i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </li>
        ))}
      </ul>

    </div></div>
  );
};

export default Todo;
