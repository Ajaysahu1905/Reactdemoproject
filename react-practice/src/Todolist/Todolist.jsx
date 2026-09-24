import { useState } from "react";
import "./App.module.css"

function Todo() {
  // This array holds all our todos. Each todo is an object with:
  // id (unique number), text (the todo message), done (true/false)
  const [todos, setTodos] = useState([
    { id: 1, text: "Learn React", done: false },
    { id: 2, text: "Build a Todo app", done: false },
  ]);

  // This holds whatever the user is currently typing in the input box
  const [input, setInput] = useState("");

  // This holds which filter is active: "all", "active", or "done"
  const [filter, setFilter] = useState("all");

  // Runs when the user clicks "Add"
  function addTodo() {
    if (input.trim() === "") return; // don't add empty todos

    const newTodo = {
      id: Date.now(),   // Date.now() gives a unique number every time
      text: input,
      done: false,
    };

    setTodos([...todos, newTodo]); // add the new todo to the list
    setInput("");                  // clear the input box
  }

  // Runs when the user clicks a todo's text (marks done/undone)
  function toggleTodo(id) {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  }

  // Runs when the user clicks "Delete"
  function deleteTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  // Decide which todos to actually show, based on the filter
  let visibleTodos = todos;
  if (filter === "active") {
    visibleTodos = todos.filter((todo) => !todo.done);
  } else if (filter === "done") {
    visibleTodos = todos.filter((todo) => todo.done);
  }

  return (
    <div className="app">
      <h1>My Todo List</h1>

      {/* Input + Add button */}
      <div className="input-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new todo..."
        />
        <button onClick={addTodo}>Add</button>
      </div>

      {/* Filter buttons */}
      <div className="filter-row">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("active")}>Active</button>
        <button onClick={() => setFilter("done")}>Done</button>
      </div>

      {/* The actual list */}
      <ul>
        {visibleTodos.length === 0 && <p>No todos to show.</p>}

        {visibleTodos.map((todo) => (
          <li key={todo.id}>
            <span
              onClick={() => toggleTodo(todo.id)}
              style={{
                textDecoration: todo.done ? "line-through" : "none",
                cursor: "pointer",
              }}
            >
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;