
import React, { useState, useEffect } from "react";

const App = () => {
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const [newPostTitle, setNewPostTitle] = useState("");
    const [newPostContent, setNewPostContent] = useState("");
    const [newCommentBody, setNewCommentBody] = useState("");

    // Load current user from localStorage
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        if (user) {
            setCurrentUser(user);
        }
    }, []);

    // Fetch posts for the current user
    useEffect(() => {
        if (currentUser && currentUser.id) {
            fetchPosts(currentUser.id);
        }
    }, [currentUser]);

    const fetchPosts = async (userId) => {
        try {
            const response = await fetch(`http://localhost:3000/posts?userId=${userId}`);
            if (response.ok) {
                const data = await response.json();
                setPosts(data || []);
            } else {
                console.error("Failed to fetch posts");
            }
        } catch (error) {
            console.error("Error fetching posts", error);
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

    const addPost = async () => {
        if (!newPostTitle || !newPostContent) {
            alert("Please provide both title and content for the post.");
            return;
        }

        const newPost = {
            title: newPostTitle,
            content: newPostContent,
            userId: currentUser.id,
        };

        try {
            const response = await fetch("http://localhost:3000/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newPost),
            });

            if (response.ok) {
                const createdPost = await response.json();
                setPosts([...posts, createdPost]);
                setNewPostTitle("");
                setNewPostContent("");
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
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: newTitle, content: newContent }),
            });

            if (response.ok) {
                setPosts(posts.map((post) => (post.id === postId ? { ...post, title: newTitle, content: newContent } : post)));
            } else {
                console.error("Failed to update post");
            }
        } catch (error) {
            console.error("Error updating post", error);
        }
    };

    const addComment = async (postId) => {
        if (!newCommentBody) {
            alert("Please provide content for the comment.");
            return;
        }

        const newComment = {
            postId,
            body: newCommentBody,
            name: currentUser.name,
            email: currentUser.email,
        };

        try {
            const response = await fetch(`http://localhost:3000/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newComment),
            });

            if (response.ok) {
                const createdComment = await response.json();
                setComments([...comments, createdComment]);
                setNewCommentBody("");
            } else {
                console.error("Failed to add comment");
            }
        } catch (error) {
            console.error("Error adding comment", error);
        }
    };

    const deleteComment = async (commentId) => {
        try {
            const response = await fetch(`http://localhost:3000/comments/${commentId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setComments(comments.filter((comment) => comment.id !== commentId));
            } else {
                console.error("Failed to delete comment");
            }
        } catch (error) {
            console.error("Error deleting comment", error);
        }
    };

    return (
        <div>
            <h2>Welcome, {currentUser?.name || "Guest"}</h2>

            {/* Add Post Section */}
            <div>
                <h3>Add a New Post</h3>
                <input
                    type="text"
                    placeholder="Title"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                />
                <textarea
                    placeholder="Content"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                />
                <button onClick={addPost}>Add Post</button>
            </div>

            {/* Post List Section */}
            <h3>Your Posts</h3>
            <ul>
                {posts.map((post) => (
                    <li key={post.id}>
                        <strong>{post.title}</strong>
                        <button onClick={() => fetchComments(post.id)}>View Comments</button>
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
                        <button onClick={() => deletePost(post.id)}>Delete</button>
                    </li>
                ))}
            </ul>

            {/* Comments Section */}
            {selectedPost && (
                <div>
                    <h3>Comments for {selectedPost.title}</h3>
                    <ul>
                        {comments.map((comment) => (
                            <li key={comment.id}>
                                <p>{comment.body}</p>
                                {comment.email === currentUser.email && (
                                    <button onClick={() => deleteComment(comment.id)}>Delete</button>
                                )}
                            </li>
                        ))}
                    </ul>
                    <textarea
                        placeholder="Add a comment"
                        value={newCommentBody}
                        onChange={(e) => setNewCommentBody(e.target.value)}
                    />
                    <button onClick={() => addComment(selectedPost.id)}>Add Comment</button>
                </div>
            )}
        </div>
    );
};

export default App;