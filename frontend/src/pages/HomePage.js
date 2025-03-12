import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Bienvenue dans To-Do List</h1>
      <button onClick={() => navigate("/todo")}>Accéder à la liste</button>
    </div>
  );
};

export default HomePage;
