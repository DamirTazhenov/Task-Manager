import React, { useState } from "react";
import { register } from "../api/auth";
import { useNavigate } from "react-router-dom"; // Используем useNavigate вместо useHistory

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); // Используем useNavigate для перенаправления

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password);

            navigate("/login");
        } catch (error) {
            console.error("Ошибка при регистрации:", error);
        }
    };

    return (
        <form onSubmit={handleRegister}>
            <h2>Регистрация</h2>
            <div>
                <input
                    type="text"
                    placeholder="Имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="email"
                    placeholder="Электронная почта"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button type="submit">Зарегистрироваться</button>
        </form>
    );
};

export default Register;
