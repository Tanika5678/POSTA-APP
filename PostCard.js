import React from "react";
import { usePosts } from "./PostsContext";

const IMAGE_BASE = "https://picsum.photos/seed";

function PostCard({ post }) {
  const { removePost } = usePosts();

  return (
    <div className="post-card">
      <button
        className="remove-btn"
        aria-label="Remove post"
        onClick={() => removePost(post.id)}
      >
        &times;
      </button>
      <h3 className="post-title">{post.title}</h3>
      <p className="post-body">{post.body}</p>
      <p className="post-date">Mon, 21 Dec 2020 14:57 GMT</p>
      <img
        className="post-image"
        src={`${IMAGE_BASE}/${post.id}/400/200`}
        alt={post.title}
        loading="lazy"
      />
    </div>
  );
}

export default PostCard;
