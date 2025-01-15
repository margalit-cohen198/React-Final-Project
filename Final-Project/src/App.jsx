import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Info from "./components/Info";
import Todos from "./components/Todos";
import Posts from "./components/Posts";
import PostDetails from "./components/PostDetails"; // קומפוננטה לפרטי פוסט
import Albums from "./components/Albums";
import Photos from "./components/Photos";

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
        <Route path="/posts/:id" element={<PostDetails />} /> {/* מסלול לפרטי פוסט */}
        <Route path="/albums" element={<Albums />} />
        <Route path="/albums/:id" element={<Photos />} />
      </Routes>
    </Router>
  );
}

export default App;
