import React from "react";


const Home = ({ user, onLogout, onNavigate }) => {
  return (
    <div>
      <h1>Welcome, {user.username}!</h1> {/* הצגת שם המשתמש */}
      <nav>
        <button onClick={() => onNavigate("/home/info")}>Info</button>
        <button onClick={() => onNavigate("/home/todos")}>Todos</button> 
        <button onClick={() => onNavigate("/home/posts")}>Posts</button> 
        <button onClick={() => onNavigate("/home/albums")}>Albums</button>
        <button onClick={onLogout}>Logout</button>
      </nav>
    </div>
  );
};

export default Home;

