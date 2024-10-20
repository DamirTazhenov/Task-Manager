import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./components/Home";
import TaskList from "./components/TaskList";
import Register from "./components/Register";
import Login from "./components/Login";
import './App.css'; // Импорт стилей

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
      <Router>
        <div className="container">
          <nav>
            <Link to="/">Home</Link>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
            <Link to="/tasks">Tasks</Link>
          </nav>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} /> {/* Передаем onLogin */}
            <Route path="/tasks" element={<TaskList />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
