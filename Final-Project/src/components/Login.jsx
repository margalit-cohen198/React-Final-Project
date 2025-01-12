import React, { useState } from "react";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function getUsers() {
        try {
            const response = await fetch(`http://localhost:3000/users?username=${username}&password=${password}`, { method: 'GET' });
            if (response.ok) {
                return await response.json(); // החזר את המידע
            }
        }
        catch (error) {
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
            window.location.href = "/home";
        } else {
            alert("Invalid username or password");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default Login;
