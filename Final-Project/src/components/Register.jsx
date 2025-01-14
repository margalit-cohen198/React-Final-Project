import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVerify, setPasswordVerify] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    async function handleRegister() {
        if (password !== passwordVerify) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const emailCheckResponse = await fetch(`http://localhost:3000/users?email=${email}`);
            const existingUsers = await emailCheckResponse.json();

            if (existingUsers.length > 0) {
                alert("Email already exists. Please use another email.");
                return;
            }

            const registerResponse = await fetch("http://localhost:3000/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: username, website: password, email: email }),
            });

            if (registerResponse.ok) {
                alert("Registration successful!");
                localStorage.setItem("currentUser",JSON.stringify({username: username, email: email}))
                navigate("/complete-registration");
            } else {
                alert("Registration failed. Please try again.");
            }
        } catch (error) {
            console.log("Error:", error);
        }
    }

    return (
        <div>
            <h2>Register</h2>
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
            <input
                type="password"
                placeholder="Verify Password"
                value={passwordVerify}
                onChange={(e) => setPasswordVerify(e.target.value)}
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleRegister}>Register</button>
        </div>
    );
}

export default Register;
