import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react";

const PostsContext = createContext(null);

const POSTS_PER_PAGE = 6;
const API_URL = "https://jsonplaceholder.typicode.com/posts";

const initialState = {
  allPosts: [],
  currentPage: 1,
  loading: true,
  error: null,
};

function postsReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, allPosts: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "SET_PAGE":
      return { ...state, currentPage: action.payload };
    case "REMOVE_POST": {
      const updatedPosts = state.allPosts.filter((post) => post.id !== action.payload);
      const totalPages = Math.max(1, Math.ceil(updatedPosts.length / POSTS_PER_PAGE));
      const newPage = state.currentPage > totalPages ? totalPages : state.currentPage;
      return { ...state, allPosts: updatedPosts, currentPage: newPage };
    }
    default:
      return state;
  }
}

export function PostsProvider({ children }) {
  const [state, dispatch] = useReducer(postsReducer, initialState);

  useEffect(() => {
    let isMounted = true;

    async function fetchPosts() {
      dispatch({ type: "FETCH_START" });
      try {
        // Enforce a minimum 5 second loading state on startup as per requirements
        const [response] = await Promise.all([
          fetch(API_URL),
          new Promise((resolve) => setTimeout(resolve, 5000)),
        ]);

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();

        if (isMounted) {
          dispatch({ type: "FETCH_SUCCESS", payload: data });
        }
      } catch (err) {
        if (isMounted) {
          dispatch({ type: "FETCH_ERROR", payload: err.message || "Something went wrong" });
        }
      }
    }

    fetchPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  const setPage = useCallback((page) => {
    dispatch({ type: "SET_PAGE", payload: page });
  }, []);

  const removePost = useCallback((postId) => {
    dispatch({ type: "REMOVE_POST", payload: postId });
  }, []);

  const totalPages = Math.max(1, Math.ceil(state.allPosts.length / POSTS_PER_PAGE));
  const startIndex = (state.currentPage - 1) * POSTS_PER_PAGE;
  const visiblePosts = state.allPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const value = {
    loading: state.loading,
    error: state.error,
    currentPage: state.currentPage,
    totalPages,
    visiblePosts,
    setPage,
    removePost,
    postsPerPage: POSTS_PER_PAGE,
  };

  return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>;
}

export function usePosts() {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error("usePosts must be used within a PostsProvider");
  }
  return context;
}
