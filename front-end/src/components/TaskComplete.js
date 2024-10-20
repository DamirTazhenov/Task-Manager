import React, { useEffect, useState } from "react";
import { fetchAllTasks } from "../api/tasks";

const TaskComplete = () => {
    const [completedTasks, setCompletedTasks] = useState([]);

    useEffect(() => {
        const loadTasks = async () => {
            try {
                const allTasks = await fetchAllTasks();
                const completed = allTasks.filter((task) => task.completed);
                setCompletedTasks(completed);
            } catch (error) {
                console.error("Ошибка при загрузке задач:", error);
            }
        };
        loadTasks();
    }, []);

    return (
        <div>
            <h2>Completed Tasks</h2>
            <ul>
                {completedTasks.map((task) => (
                    <li key={task.id}>{task.title}</li>
                ))}
            </ul>
        </div>
    );
};

export default TaskComplete;
