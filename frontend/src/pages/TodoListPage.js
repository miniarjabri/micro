import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

const TodoListPage = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");

  useEffect(() => {
    axios.get(`${API_URL}/tasks`).then((res) => setTasks(res.data));
  }, []);

  const addTask = () => {
    if (task) {
      axios.post(`${API_URL}/tasks`, { text: task }).then(() => {
        setTasks([...tasks, { text: task }]);
        setTask("");
      });
    }
  };

  return (
    <div className="container">
      <h1>Ma To-Do List</h1>
      <input type="text" value={task} onChange={(e) => setTask(e.target.value)} />
      <button onClick={addTask}>Ajouter</button>
      <ul>
        {tasks.map((t, index) => (
          <li key={index}>{t.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default TodoListPage;
