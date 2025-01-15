import React, { useState, useEffect } from "react";

const Todos = () => {
    const [todos, setTodos] = useState([]);
    const [filteredTodos, setFilteredTodos] = useState([]);
    const [sortCriteria, setSortCriteria] = useState("id");
    const [searchCriteria, setSearchCriteria] = useState("id");
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        const userId = user.id;

        const getUserTodos = async () => {
            try {
                const response = await fetch(`http://localhost:3000/todos?userId=${userId}`);
                if (response.ok) {
                    const todos = await response.json();
                    setTodos(todos);
                    setFilteredTodos(todos);
                }
            } catch (error) {
                console.log("Error fetching todos:", error);
            }
        };

        getUserTodos();
    }, []);

    const updateUserTodo = async (updatedTodo) => {
        try {
            await fetch(`http://localhost:3000/todos/${updatedTodo.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedTodo),
            });
        } catch (error) {
            console.error("Error updating todo:", error);
        }
    };

    const addTodo = async (title) => {
        const newTodo = {
            userId: userId,
            title: title,
            completed: false,
        };
        try {
            const response = await fetch(`http://localhost:3000/todos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newTodo),
            });
            if (response.ok) {
                const addedTodo = await response.json();
                const updatedTodos = [...todos, addedTodo];
                setTodos(updatedTodos);
                setFilteredTodos(updatedTodos);
            }
        } catch (error) {
            console.error("Error adding todo:", error);
        }
    };

    const deleteTodo = async (id) => {
        try {
            await fetch(`http://localhost:3000/todos/${id}`, { method: "DELETE" });
            const updatedTodos = todos.filter((todo) => todo.id !== id);
            setTodos(updatedTodos);
            setFilteredTodos(updatedTodos);
        } catch (error) {
            console.error("Error deleting todo:", error);
        }
    };

    const updateTodo = (id, newTitle) => {
        const updatedTodo = todos.find((todo) => todo.id === id);
        if (updatedTodo) {
            updatedTodo.title = newTitle;
            setTodos((prev) =>
                prev.map((todo) => (todo.id === id ? { ...todo, title: newTitle } : todo))
            );
            setFilteredTodos((prev) =>
                prev.map((todo) => (todo.id === id ? { ...todo, title: newTitle } : todo))
            );
            updateUserTodo(updatedTodo);
        }
    };

    const toggleCompletion = (id) => {
        const updatedTodo = todos.find((todo) => todo.id === id);
        if (updatedTodo) {
            updatedTodo.completed = !updatedTodo.completed;
            setTodos((prev) =>
                prev.map((todo) =>
                    todo.id === id ? { ...todo, completed: updatedTodo.completed } : todo
                )
            );
            setFilteredTodos((prev) =>
                prev.map((todo) =>
                    todo.id === id ? { ...todo, completed: updatedTodo.completed } : todo
                )
            );
            updateUserTodo(updatedTodo);
        }
    };

    const sortTodos = (criteria) => {
        const sorted = [...filteredTodos];
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

    const filterTodos = () => {
        const filtered = todos.filter((todo) => {
            if (searchCriteria === "id") return todo.id === parseInt(searchValue);
            if (searchCriteria === "title") return todo.title.toLowerCase().includes(searchValue.toLowerCase());
            if (searchCriteria === "completed") return todo.completed === (searchValue.toLowerCase() === "true");
        });
        setFilteredTodos(filtered);
    };

    return (
        <div>
            <h2>Todos</h2>
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
            <ul>
                {filteredTodos.map((todo) => (
                    <li key={todo.id}>
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => toggleCompletion(todo.id)}
                        />
                        <span>Id: {todo.id} Title: {todo.title}</span>
                        <button onClick={() => updateTodo(todo.id, prompt("New title:"))}>
                            Edit
                        </button>
                        <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                    </li>
                ))}
            </ul>
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
