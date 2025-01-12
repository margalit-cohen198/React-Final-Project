import React from "react";
import { useNavigate, Outlet } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  let user = localStorage.getItem("currentUser");
  user = JSON.parse(user);

  const onLogout = () => {
    localStorage.setItem("currentUser", "");
    navigate("/"); // חזרה לעמוד הראשי
  };

  return (
    <div>
      <h1>Welcome, {user?.username || "Guest"}!</h1>
      <nav>
        <button onClick={() => navigate("/home/info")}>Info</button>
        <button onClick={() => navigate("/todos")}>Todos</button>
        <button onClick={() => navigate("/posts")}>Posts</button>
        <button onClick={() => navigate("/albums")}>Albums</button>
        <button onClick={onLogout}>Logout</button>
      </nav>

      {/* Info יופיע כאן בלבד */}
      <Outlet />
    </div>
  );
};

export default Home;
