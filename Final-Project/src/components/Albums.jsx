import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Albums = () => {
  const [albums, setAlbums] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState("id");
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  useEffect(() => {

    async function fetchAlbums() {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      const userId = user.id;
      try {
        const response = await fetch(
          `http://localhost:3000/albums?userId=${userId}`
        );
        if (response.ok) {
          const albums = await response.json();
          if (albums.length > 0) {
            setAlbums(albums || []);
            setFilteredAlbums(albums || []);
          }
        }
      } catch (error) {
        console.log("Error fetching albums:", error);
      }
    }
    fetchAlbums();
  }, []);

  const filterAlbums = () => {
    const filtered = albums.filter((album) => {
      if (searchCriteria === "id") {
        return album.id === parseInt(searchValue);
      } else if (searchCriteria === "title") {
        return album.title.toLowerCase().includes(searchValue.toLowerCase());
      }
    });
    setFilteredAlbums(filtered);
  };

  const addAlbum = async (title) => {
    if (!title.trim()) {
      alert("Album title cannot be empty!");
      return;
    }
    const newAlbum = {
      userId: userId,
      title: title
    };

    try {
      const response = await fetch(`http://localhost:3000/albums`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAlbum),
      });

      if (response.ok) {
        const addedAlbum = await response.json();
        setAlbums((prev) => [...prev, addedAlbum]);
        setFilteredAlbums((prev) => [...prev, addedAlbum]);
      } else {
        console.log("Failed to add album");
      }
    } catch (error) {
      console.log("Error adding album:", error);
    }
  };


  return (
    <div>
      <h2>Albums</h2>

      <div>
        <label>Search by:</label>
        <select
          value={searchCriteria}
          onChange={(e) => setSearchCriteria(e.target.value)}
        >
          <option value="id">ID</option>
          <option value="title">Title</option>
        </select>
        <input
          type="text"
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button onClick={filterAlbums}>Search</button>
      </div>

      <ul>
        {filteredAlbums.map((album) => (
          <li key={album.id}>
            <span>
              Album Id: {album.id}  Album Name: {album.title}
            </span>
            <button onClick={() => navigate(`/albums/${album.id}`)}>
              View Photos
            </button>
          </li>
        ))}
      </ul>

      <div>
        <input
          type="text"
          id="newAlbumTitle"
          placeholder="New Album Title..."
        />
        <button
          onClick={() =>
            addAlbum(document.getElementById("newAlbumTitle").value)
          }
        >
          Add Album
        </button>
      </div>
    </div>
  );
};

export default Albums;
