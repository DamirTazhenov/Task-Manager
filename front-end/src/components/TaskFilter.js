import React, { useState, useEffect } from "react";
import { fetchTasksByPeriod } from "../api/tasks";

const TaskFilter = () => {
    const [period, setPeriod] = useState("day");
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const loadTasksByPeriod = async () => {
            try {
                const data = await fetchTasksByPeriod(period);
                setTasks(data);
            } catch (error) {
                console.error("Ошибка при загрузке задач:", error);
            }
        };
        loadTasksByPeriod();
    }, [period]);

    return (
        <div>
            <h2>Tasks by {period}</h2>
            <select onChange={(e) => setPeriod(e.target.value)} value={period}>
                <option value="day">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
            </select>
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        {task.title} - {task.completed ? "Completed" : "Pending"}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskFilter;
