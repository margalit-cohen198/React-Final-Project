import React, { useState, useEffect } from "react";

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [postTitle, setPostTitle] = useState("");
    const [postContent, setPostContent] = useState("");
    const [selectedPost, setSelectedPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [userId, setUserId] = useState(null); // שמירת userId ב-state

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        if (user && user.id) {
            setUserId(user.id); // הגדרת userId פעם אחת
        }

        async function fetchPosts() {
            try {
                const response = await fetch(`http://localhost:3000/posts?userId=${user.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setPosts(data || []);
                } else {
                    console.error("Failed to fetch posts");
                }
            } catch (error) {
                console.error("Error fetching posts", error);
            }
        }

        if (user && user.id) fetchPosts();
    }, []);

    const addPost = async () => {
        if (!postTitle || !postContent) {
            alert("Please provide both title and content for the post.");
            return;
        }

        const newPost = {
            title: postTitle,
            content: postContent,
            userId, // שימוש ב-userId מ-state
        };

        try {
            const response = await fetch(`http://localhost:3000/posts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newPost),
            });

            if (response.ok) {
                const createdPost = await response.json();
                setPosts([...posts, createdPost]);
                setPostTitle("");
                setPostContent("");
            } else {
                console.error("Failed to add post");
            }
        } catch (error) {
            console.error("Error adding post", error);
        }
    };

    const deletePost = async (postId) => {
        try {
            const response = await fetch(`http://localhost:3000/posts/${postId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setPosts(posts.filter((post) => post.id !== postId));
            } else {
                console.error("Failed to delete post");
            }
        } catch (error) {
            console.error("Error deleting post", error);
        }
    };

    const updatePost = async (postId, newTitle, newContent) => {
        try {
            const response = await fetch(`http://localhost:3000/posts/${postId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title: newTitle, content: newContent }),
            });

            if (response.ok) {
                setPosts(
                    posts.map((post) =>
                        post.id === postId ? { ...post, title: newTitle, content: newContent } : post
                    )
                );
            } else {
                console.error("Failed to update post");
            }
        } catch (error) {
            console.error("Error updating post", error);
        }
    };

    const fetchComments = async (postId) => {
        try {
            const response = await fetch(`http://localhost:3000/posts/${postId}/comments`);
            if (response.ok) {
                const data = await response.json();
                setComments(data || []);
            } else {
                console.error("Failed to fetch comments");
            }
        } catch (error) {
            console.error("Error fetching comments", error);
        }
    };

    return (
        <div>
            <h2>Posts for User {userId || "Unknown"}</h2>

            {/* Post List */}
            <ul>
                {posts.map((post) => (
                    <li key={post.id}>
                        <p>{post.title}</p>
                        <button
                            onClick={() => {
                                setSelectedPost(post);
                                fetchComments(post.id);
                            }}
                        >
                            View
                        </button>
                        <button onClick={() => deletePost(post.id)}>Delete</button>
                        <button
                            onClick={() =>
                                updatePost(
                                    post.id,
                                    prompt("Enter new title:", post.title),
                                    prompt("Enter new content:", post.content)
                                )
                            }
                        >
                            Edit
                        </button>
                    </li>
                ))}
            </ul>

            {/* Add New Post */}
            <div>
                <h3>Add New Post</h3>
                <input
                    type="text"
                    placeholder="Post Title"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Post Content"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                />
                <button onClick={addPost}>Add Post</button>
            </div>

            {/* Selected Post and Comments */}
            {selectedPost && (
                <div>
                    <h3>{selectedPost.title}</h3>
                    <p>{selectedPost.content}</p>
                    <h4>Comments</h4>
                    <ul>
                        {comments.map((comment) => (
                            <li key={comment.id}>{comment.content}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Posts;
