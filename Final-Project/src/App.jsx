import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Info from "./components/Info";
import Todos from "./components/Todos";
import Posts from "./components/Posts";
import Albums from "./components/Albums";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Home כעמוד בסיסי */}
        <Route path="/home" element={<Home />}>
          {/* מסלול מקונן עבור Info */}
          <Route path="info" element={<Info />} />
        </Route>

        {/* שאר העמודים כרמה עצמאית */}
        <Route path="/todos" element={<Todos />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/albums" element={<Albums />} />
      </Routes>
    </Router>
  );
}

export default App;
