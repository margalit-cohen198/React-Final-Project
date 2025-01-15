import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Photos = () => {
    const { id: albumId } = useParams();
    const [photos, setPhotos] = useState([]);
    const [photoTitle, setPhotoTitle] = useState("");
    const [photoUrl, setPhotoUrl] = useState("");
    const [page, setPage] = useState(1); // עמוד נוכחי
    const [hasMore, setHasMore] = useState(true); // בודק אם יש עוד תמונות לטעון

    const PHOTOS_PER_PAGE = 1; // מספר התמונות בכל טעינה

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3000/photos?albumId=${albumId}&_page=${page}&_limit=${PHOTOS_PER_PAGE}`
                );
                if (response.ok) {
                    const newPhotos = await response.json();
                    setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
                    if (newPhotos.length < PHOTOS_PER_PAGE) {
                        setHasMore(false); // אם אין יותר תמונות, נעצור את הטעינה
                    }
                } else {
                    console.log("Failed to fetch photos");
                }
            } catch (error) {
                console.log("Error fetching photos", error);
            }
        };
        fetchPhotos();
    }, [page, albumId]);

    const loadMorePhotos = () => {
        if (hasMore) {
            setPage((prevPage) => prevPage + 1); // טוען עמוד נוסף
        }
    };

    const addPhoto = async () => {
        if (!photoTitle || !photoUrl) {
            alert("Please provide both title and URL for the photo.");
            return;
        }

        const newPhoto = {
            albumId: albumId,
            title: photoTitle,
            thumbnailUrl: photoUrl,
        };

        try {
            const response = await fetch(`http://localhost:3000/photos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newPhoto),
            });

            if (response.ok) {
                const addedPhoto = await response.json();
                setPhotos((prevPhotos) => [addedPhoto, ...prevPhotos]); // מוסיף את התמונה לראש הרשימה
                setPhotoTitle("");
                setPhotoUrl("");
            } else {
                console.log("Failed to add photo");
            }
        } catch (error) {
            console.log("Error adding photo", error);
        }
    };

    const deletePhoto = async (photoId) => {
        try {
            await fetch(`http://localhost:3000/photos/${photoId}`, {
                method: "DELETE",
            });
            setPhotos((prevPhotos) =>
                prevPhotos.filter((photo) => photo.id !== photoId)
            );
        } catch (error) {
            console.log("Error deleting photo", error);
        }
    };

    const updatePhoto = async (photoId, newTitle, newUrl) => {
        try {
            await fetch(`http://localhost:3000/photos/${photoId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title: newTitle, thumbnailUrl: newUrl }),
            });
            setPhotos((prevPhotos) =>
                prevPhotos.map((photo) =>
                    photo.id === photoId
                        ? { ...photo, title: newTitle, thumbnailUrl: newUrl }
                        : photo
                )
            );
        } catch (error) {
            console.error("Error updating photo", error);
        }
    };

    return (
        <div>
            <h2>Photos for Album number {albumId}</h2>
            <ul>
                {photos.map((photo) => (
                    <li key={photo.id}>
                        <p>{photo.title}</p>
                        <img
                            src={photo.thumbnailUrl}
                            alt={photo.title}
                            width="100"
                        />
                        <button onClick={() => deletePhoto(photo.id)}>
                            Delete
                        </button>
                        <button
                            onClick={() =>
                                updatePhoto(
                                    photo.id,
                                    prompt("Enter new title:", photo.title),
                                    prompt("Enter new URL:", photo.thumbnailUrl)
                                )
                            }
                        >
                            Update
                        </button>
                    </li>
                ))}
            </ul>
            {hasMore && (
                <button onClick={loadMorePhotos}>Load More Photos</button>
            )}
            <div>
                <h3>Add New Photo</h3>
                <input
                    type="text"
                    placeholder="Photo Title"
                    value={photoTitle}
                    onChange={(e) => setPhotoTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Photo URL"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                />
                <button onClick={addPhoto}>Add Photo</button>
            </div>
        </div>
    );
};

export default Photos;
