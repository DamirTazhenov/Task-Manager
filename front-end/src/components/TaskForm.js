import React, { useState } from "react";
import { createTask } from "../api/tasks";

const TaskForm = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createTask({ title, description });
            setTitle("");
            setDescription("");
        } catch (error) {
            console.error("Ошибка при создании задачи:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create Task</h2>
            <div>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <button type="submit">Create Task</button>
        </form>
    );
};

export default TaskForm;
