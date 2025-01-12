import React, { useState, useEffect } from "react";

const Todos = () => {
    // State לניהול רשימת ה-Todos והקריטריונים
    const [todos, setTodos] = useState([]);
    const [filteredTodos, setFilteredTodos] = useState([]);
    const [sortCriteria, setSortCriteria] = useState("id");
    const [searchCriteria, setSearchCriteria] = useState("id");
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        const username = user.username;
    
        async function getUserTodos() {
            try {
                const response = await fetch(`https://my-json-server.typicode.com/margalit-cohen198/React-Final-Project/users?username=${username}`, { method: 'GET' });
                if (response.ok) {
                    const users = await response.json();
                    if (users.length > 0) {
                        return users[0].todos; // החזר את המשימות של המשתמש הראשון
                    }
                }
            }
            catch (error) {
                console.log(error);
            }
            return []; // החזר מערך ריק אם יש בעיה

        }
    
        const getUserData = async () => {
            const userTodos = await getUserTodos();
            setTodos(userTodos);
            setFilteredTodos(userTodos);
        }
    
        getUserData();
    }, []);
    

// פונקציה למיון פריטים
const sortTodos = (criteria) => {
    let sorted = [...filteredTodos];
    switch (criteria) {
        case "id":
            sorted.sort((a, b) => a.id - b.id);
            break;
        case "title":
            sorted.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case "completed":
            sorted.sort((a, b) => a.completed - b.completed);
            break;
        case "random":
            sorted.sort(() => Math.random() - 0.5);
            break;
        default:
            break;
    }
    setFilteredTodos(sorted);
};

// פונקציה לחיפוש פריטים
const filterTodos = () => {
    const filtered = todos.filter((todo) => {
        if (searchCriteria === "id") return todo.id === parseInt(searchValue);
        if (searchCriteria === "title") return todo.title.toLowerCase().includes(searchValue.toLowerCase());
        if (searchCriteria === "completed") return todo.completed === (searchValue.toLowerCase() === "true");
        return true;
    });
    setFilteredTodos(filtered);
};

// פונקציה להוספת פריט
const addTodo = (title) => {
    const newTodo = {
        id: todos.length ? todos[todos.length - 1].id + 1 : 1,
        title,
        completed: false,
    };
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    setFilteredTodos(updatedTodos);
};

// פונקציה למחיקת פריט
const deleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    setFilteredTodos(updatedTodos);
};

// פונקציה לעדכון פריט
const updateTodo = (id, newTitle) => {
    const updatedTodos = todos.map((todo) =>
        todo.id === id ? { ...todo, title: newTitle } : todo
    );
    setTodos(updatedTodos);
    setFilteredTodos(updatedTodos);
};

// פונקציה לעדכון מצב ביצוע
const toggleCompletion = (id) => {
    const updatedTodos = todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    setFilteredTodos(updatedTodos);
};

return (
    <div>
        <h2>Todos</h2>

        {/* מיון */}
        <div>
            <label>Sort by:</label>
            <select
                value={sortCriteria}
                onChange={(e) => {
                    setSortCriteria(e.target.value);
                    sortTodos(e.target.value);
                }}
            >
                <option value="id">ID</option>
                <option value="title">Alphabetical</option>
                <option value="completed">Completed</option>
                <option value="random">Random</option>
            </select>
        </div>

        {/* חיפוש */}
        <div>
            <label>Search by:</label>
            <select
                value={searchCriteria}
                onChange={(e) => setSearchCriteria(e.target.value)}
            >
                <option value="id">ID</option>
                <option value="title">Title</option>
                <option value="completed">Completed</option>
            </select>
            <input
                type="text"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />
            <button onClick={filterTodos}>Search</button>
        </div>

        {/* רשימת Todos */}
        <ul>
            {filteredTodos.map((todo) => (
                <li key={todo.id}>
                    <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleCompletion(todo.id)}
                    />
                    <span>{todo.title}</span>
                    <button onClick={() => updateTodo(todo.id, prompt("New title:"))}>
                        Edit
                    </button>
                    <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                </li>
            ))}
        </ul>

        {/* הוספה */}
        <div>
            <input
                type="text"
                id="newTodoTitle"
                placeholder="New Todo..."
            />
            <button onClick={() => addTodo(document.getElementById("newTodoTitle").value)}>
                Add
            </button>
        </div>
    </div>
);
};

export default Todos;
