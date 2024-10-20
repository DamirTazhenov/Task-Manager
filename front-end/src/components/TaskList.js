import React, { useEffect, useState } from "react";
import { fetchAllTasks, createTask, updateTaskStatus, deleteTask } from "../api/tasks";
import './TaskList.css';

const TaskList = () => {
    const [tasksByMonth, setTasksByMonth] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [newTask, setNewTask] = useState({ title: "", description: "" });
    const [taskToDelete, setTaskToDelete] = useState(null); // Задача, которую нужно удалить

    useEffect(() => {
        const loadTasks = async () => {
            try {
                const data = await fetchAllTasks();
                groupTasksByMonth(data);
            } catch (error) {
                console.error("Ошибка при загрузке задач:", error);
            }
        };
        loadTasks();
    }, []);

    const groupTasksByMonth = (tasks) => {
        const groupedTasks = tasks.reduce((acc, task) => {
            if (task.CreatedAt) {
                const taskDate = new Date(task.CreatedAt);
                if (!isNaN(taskDate)) {
                    const monthYear = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(taskDate);

                    if (!acc[monthYear]) {
                        acc[monthYear] = [];
                    }
                    acc[monthYear].push(task);
                } else {
                    console.error(`Некорректное значение даты: ${task.CreatedAt}`);
                }
            } else {
                console.error("Отсутствует поле CreatedAt у задачи:", task);
            }
            return acc;
        }, {});

        setTasksByMonth(groupedTasks);
    };

    const handleCreateTask = async () => {
        try {
            const createdTask = await createTask(newTask);
            const updatedTasks = { ...tasksByMonth };
            const monthYear = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(createdTask.CreatedAt));

            if (!updatedTasks[monthYear]) {
                updatedTasks[monthYear] = [];
            }
            updatedTasks[monthYear].push(createdTask);

            setTasksByMonth(updatedTasks);
            setNewTask({ title: "", description: "" });
            setShowModal(false);
        } catch (error) {
            console.error("Ошибка при создании задачи:", error);
        }
    };

    const handleStatusChange = async (taskId, task) => {
        try {
            const updatedTask = { ...task, completed: !task.completed }; // Меняем статус
            const updatedTaskFromServer = await updateTaskStatus(taskId, updatedTask);

            // Обновляем состояние с новыми данными
            const updatedTasks = { ...tasksByMonth };
            Object.keys(updatedTasks).forEach((month) => {
                updatedTasks[month] = updatedTasks[month].map((task) =>
                    task.ID === taskId ? updatedTaskFromServer : task
                );
            });

            setTasksByMonth(updatedTasks);
        } catch (error) {
            console.error("Ошибка при изменении статуса задачи:", error);
        }
    };

    const handleDeleteTask = async () => {
        try {
            console.log(taskToDelete)
            await deleteTask(taskToDelete);
            const updatedTasks = { ...tasksByMonth };

            Object.keys(updatedTasks).forEach((month) => {
                updatedTasks[month] = updatedTasks[month].filter((task) => task.ID !== taskToDelete);
            });

            setTasksByMonth(updatedTasks);
            setShowDeleteModal(false);
            setTaskToDelete(null);
        } catch (error) {
            console.error("Ошибка при удалении задачи:", error);
        }
    };

    return (
        <div className="task-list-container">
            <h2>All Tasks</h2>
            <button className="create-task-btn" onClick={() => setShowModal(true)}>
                Create New Task
            </button>
            {Object.keys(tasksByMonth).map((month) => (
                <div key={month} className="task-month-group">
                    <h3>{month}</h3>
                    <div className="task-list">
                        {tasksByMonth[month].map((task) => (
                            <div className="task-card-wrapper" key={task.id}>
                                <div className={`task-card ${task.completed ? "completed" : ""}`}>
                                    <div className="task-card-front">
                                        <h3>{task.title}</h3>
                                        <p>{task.description || "No description provided"}</p>
                                        <p>Status: {task.completed ? "Completed" : "Pending"}</p>
                                        {task.CreatedAt && (
                                            <p>{new Intl.DateTimeFormat('en-US', {
                                                year: 'numeric', month: 'long', day: 'numeric',
                                                hour: 'numeric', minute: 'numeric'
                                            }).format(new Date(task.CreatedAt))}</p>
                                        )}
                                        {/* Кнопка смены статуса */}
                                        <button onClick={() => handleStatusChange(task, !task.completed)}>
                                            {task.completed ? "Mark as Pending" : "Mark as Completed"}
                                        </button>
                                        {/* Кнопка удаления */}
                                        <button onClick={() => {
                                            console.log("Task to delete:", task);
                                            setTaskToDelete(task.ID);
                                            setShowDeleteModal(true);
                                        }}>
                                            Delete Task
                                        </button>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* Модальное окно создания задачи */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Create New Task</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleCreateTask(); }}>
                            <div>
                                <label>Task Title</label>
                                <input
                                    type="text"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label>Task Description</label>
                                <textarea
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <button type="submit">Create Task</button>
                                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Модальное окно подтверждения удаления */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Are you sure you want to delete this task?</h2>
                        <div>
                            <button onClick={handleDeleteTask}>Yes, Delete</button>
                            <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskList;
