import axios from "axios";

const API_URL = "http://localhost:8080";

// Авторизация (получение JWT токена)
export const login = async (email, password) => {
    console.log(API_URL);
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data.token) {
        localStorage.setItem("accessToken", response.data.token);
    }
    return response.data;
};

export const register = async (name, email, password) => {
    try {
        const response = await axios.post(`${API_URL}/register`, {
            name,
            email,
            password,
        });

        // Обработка успешного ответа, если возвращается токен
        return response.data; // Ожидаем, что в data будет объект с токеном
    } catch (error) {
        throw new Error("Ошибка при регистрации");
    }
};

// Получение текущего токена из localStorage
export const getToken = () => {
    return localStorage.getItem("accessToken");
};

// Выход (удаление токена)
export const logout = () => {
    localStorage.removeItem("accessToken");
};
