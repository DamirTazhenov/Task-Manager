import axios from "axios";
import { getToken } from "./auth";

const API_URL = "http://localhost:8080/api";

// Получение всех задач
export const fetchAllTasks = async () => {
    const response = await axios.get(`${API_URL}/tasks`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
    return response.data;
};

// Получение задач за определенный период
export const fetchTasksByPeriod = async (period) => {
    const response = await axios.get(`${API_URL}/tasks/period?period=${period}`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
    return response.data;
};

// Функция для создания новой задачи
export const createTask = async (task) => {
    try {
        const response = await axios.post(`${API_URL}/tasks`, task, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка при создании задачи:", error);
        throw error;
    }
};

// Функция для обновления статуса задачи
export const updateTaskStatus = async (taskId, updatedTask) => {
    try {
        const response = await axios.put(`${API_URL}/tasks/${taskId.ID}`, updatedTask, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка при обновлении задачи:", error);
        throw error;
    }
};

// Функция для удаления задачи
export const deleteTask = async (taskId) => {
    try {
        const response = await axios.delete(`${API_URL}/tasks/${taskId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка при удалении задачи:", error);
        throw error;
    }
};