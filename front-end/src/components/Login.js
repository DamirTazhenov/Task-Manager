import React, { useState } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './Login.css'; // Импортируем стили

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);

            if (onLogin) {
                onLogin();
            }

            // Показать уведомление об успешной авторизации
            toast.success("Успешная авторизация!");

            // Перенаправляем на главную страницу через несколько секунд
            setTimeout(() => {
                navigate("/");
            }, 2000); // 2 секунды задержки для показа уведомления
        } catch (error) {
            console.error("Ошибка при входе:", error);
            toast.error("Ошибка при входе");
        }
    };

    return (
        <div>
            <form onSubmit={handleLogin}>
                <h2>Login</h2>
                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Login</button>
            </form>

            <ToastContainer />
        </div>
    );
};

export default Login;
