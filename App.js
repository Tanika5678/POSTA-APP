import React from "react";
import { PostsProvider, usePosts } from "./PostsContext";
import PostCard from "./PostCard";
import Pagination from "./Pagination";
import "./styles.css";

function PostsList() {
  const { loading, error, visiblePosts } = usePosts();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (visiblePosts.length === 0) {
    return <div className="empty">No posts to display.</div>;
  }

  return (
    <>
      <div className="posts-grid">
        {visiblePosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <Pagination />
    </>
  );
}

function App() {
  return (
    <PostsProvider>
      <div className="app-container">
        <h1 className="app-title">Posts</h1>
        <PostsList />
      </div>
    </PostsProvider>
  );
}

export default App;
