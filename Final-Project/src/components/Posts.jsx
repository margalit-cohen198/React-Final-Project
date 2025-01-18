import React, { useState, useEffect } from "react";

const App = () => {
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const [newCommentBody, setNewCommentBody] = useState("");
    const [viewingOtherUsers, setViewingOtherUsers] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("id");
    const [highlightedPost, setHighlightedPost] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        if (user) {
            setCurrentUser(user);
        }
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [currentUser, viewingOtherUsers]);

    const fetchPosts = async () => {
        if (!currentUser) return;
        const url = viewingOtherUsers ? "http://localhost:3000/posts" : `http://localhost:3000/posts?userId=${currentUser.id}`;
        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                setPosts(data || []);
            }
        } catch (error) {
            console.error("Error fetching posts", error);
        }
    };

    const fetchComments = async (postId) => {
        try {
            const response = await fetch(`http://localhost:3000/comments?postId=${postId}`);
            if (response.ok) {
                const data = await response.json();
                setComments(data || []);
                setSelectedPost(posts.find(post => post.id === postId));
            }
        } catch (error) {
            console.error("Error fetching comments", error);
        }
    };

    const addComment = async (postId) => {
        if (!newCommentBody) return;
        const newComment = {
            postId,
            body: newCommentBody,
            name: currentUser.name,
            email: currentUser.email,
        };

        try {
            const response = await fetch("http://localhost:3000/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newComment),
            });

            if (response.ok) {
                const createdComment = await response.json();
                setComments([...comments, createdComment]);
                setNewCommentBody("");
            }
        } catch (error) {
            console.error("Error adding comment", error);
        }
    };

    const deletePost = async (postId) => {
        try {
            const response = await fetch(`http://localhost:3000/posts/${postId}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setPosts(posts.filter(post => post.id !== postId));
                if (selectedPost?.id === postId) setSelectedPost(null);
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
                setPosts(posts.map(post => post.id === postId ? { ...post, title: newTitle, content: newContent } : post));
            }
        } catch (error) {
            console.error("Error updating post", error);
        }
    };

    const sortedPosts = posts.filter(post =>
        post.id.toString().includes(searchQuery) || post.title.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => (sortBy === "id" ? a.id - b.id : a.title.localeCompare(b.title)));

    return (
        <div>
            <h2>Welcome, {currentUser?.name || "Guest"}</h2>
            <button onClick={() => setViewingOtherUsers(!viewingOtherUsers)}>
                {viewingOtherUsers ? "View My Posts" : "View All Posts"}
            </button>
            <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <button onClick={() => setSortBy(sortBy === "id" ? "title" : "id")}>Sort by {sortBy === "id" ? "Title" : "ID"}</button>

            <h3>{viewingOtherUsers ? "All Posts" : "My Posts"}</h3>
            <ul>
                {sortedPosts.map((post) => (
                    <li key={post.id} style={{ backgroundColor: highlightedPost === post.id ? "yellow" : "white" }}>
                        <strong>{post.id} - {post.title}</strong>
                        <button onClick={() => fetchComments(post.id)}>View Comments</button>
                        <button onClick={() => setSelectedPost(post)}>View Full Content</button>
                        <button onClick={() => setHighlightedPost(highlightedPost === post.id ? null : post.id)}>Highlight</button>
                        {!viewingOtherUsers && post.userId === currentUser?.id && (
                            <>
                                <button onClick={() => updatePost(post.id, prompt("New title:", post.title), prompt("New content:", post.content))}>Edit</button>
                                <button onClick={() => deletePost(post.id)}>Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>

            {selectedPost && (
                <div>
                    <h3>{selectedPost.title}</h3>
                    <p>{selectedPost.content}</p>
                    <h4>Comments:</h4>
                    <ul>
                        {comments.map(comment => (
                            <li key={comment.id}>{comment.body} - <i>{comment.name}</i></li>
                        ))}
                    </ul>
                    <input
                        type="text"
                        placeholder="Add a comment..."
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