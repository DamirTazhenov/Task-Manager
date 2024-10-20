import React from "react";
import { Link } from "react-router-dom";
import './Home.css';

const Home = () => {
    return (
        <div className="home-container">
            <header className="header">
                <h1 className="header-title">Welcome to the Task Manager</h1>
            </header>
            <main className="main-content">
                <p className="description">Manage your tasks efficiently and stay productive.</p>
                <div className="links">
                    <Link to="/tasks" className="link">View Tasks</Link>
                    <span> | </span>
                    <Link to="/task-complete" className="link">Complete Tasks</Link>
                </div>
            </main>
            <footer className="footer">
                <p className="footer-text">© 2024 Task Manager. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
