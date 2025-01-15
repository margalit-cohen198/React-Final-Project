import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function getUsers() {
        try {
            const response = await fetch(`http://localhost:3000/users?email=${email}&website=${password}`, { method: 'GET' });
            if (response.ok) {
                return await response.json(); // החזר את המידע
            }
        } catch (error) {
            console.log(error);
        }
        return []; // החזר מערך ריק אם יש בעיה
    }

    async function handleLogin() {
        let user = null;
        const users = await getUsers();
        if (users.length > 0) {
            user = users[0];
        }
        if (user) {
            localStorage.setItem("currentUser", JSON.stringify(user));
            alert("Login successful");
            navigate("/home");
        } else {
            alert("Invalid email or password");
        }
    }

    return (
        <div>
            <h2>Login</h2>
            <input
                type="text"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            <p>Don't have an account?</p>
            <button onClick={() => navigate("/register")}>Go to Register</button>
        </div>
    );
}

export default Login;
