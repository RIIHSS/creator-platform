import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { user, logout, loading } = useAuth();

  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await api.get(
          `/api/posts?page=${currentPage}&limit=10`
        );

        setPosts(response.data.data);
        setPagination(response.data.pagination);
      } catch (err) {
        setError('Failed to load posts');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleDelete = async (postId) => {
    try {
      await api.delete(`/api/posts/${postId}`);
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (err) {
      setError('Failed to delete post');
      console.error(err);
    }
  };

  // Auth loading
  if (loading) {
    return <div style={loadingStyle}>Loading...</div>;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div style={containerStyle}>

      {/* HEADER */}
      <div style={headerStyle}>
        <div>
          <h1>Your Posts</h1>
          <p>Welcome back, {user.name}!</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/create">
            <button style={createButtonStyle}>
              + Create New Post
            </button>
          </Link>

          <button onClick={logout} style={logoutButtonStyle}>
            Logout
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && <div style={errorStyle}>{error}</div>}

      {/* LOADING */}
      {isLoading ? (
        <div style={loadingStyle}>Loading posts...</div>
      ) : (
        <div style={postsContainerStyle}>

          {/* EMPTY STATE */}
          {posts.length === 0 ? (
            <div style={emptyStateStyle}>
              <p>You haven't created any posts yet.</p>
              <Link to="/create">Create your first post</Link>
            </div>
          ) : (
            <>
              {/* POSTS */}
              {posts.map((post) => (
                <div key={post._id} style={postCardStyle}>
                  <h3>{post.title}</h3>

                  <p style={contentPreviewStyle}>
                    {post.content.substring(0, 150)}...
                  </p>

                  <div style={metaStyle}>
                    <span>{post.category}</span>
                    <span>{post.status}</span>
                    <span>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* ✅ YOUR SNIPPET ADDED HERE (UNCHANGED) */}
                  <div style={actionsStyle}>
                    <Link to={`/edit/${post._id}`}>
                      <button style={editButtonStyle}>
                        Edit
                      </button>
                    </Link>
                    
                    <button 
                      onClick={() => handleDelete(post._id)}
                      style={deleteButtonStyle}
                    >
                      Delete
                    </button>
                  </div>

                </div>
              ))}

              {/* PAGINATION */}
              <div style={paginationStyle}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  style={paginationButtonStyle}
                >
                  Previous
                </button>

                <span style={pageInfoStyle}>
                  Page {pagination.page} of {pagination.totalPages} (
                  {pagination.total} posts)
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  style={paginationButtonStyle}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

/* ================= STYLES ================= */

const containerStyle = {
  minHeight: '80vh',
  padding: '2rem',
  maxWidth: '1200px',
  margin: '0 auto',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '2rem',
};

const createButtonStyle = {
  padding: '0.5rem 1.5rem',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const logoutButtonStyle = {
  padding: '0.5rem 1.5rem',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const postsContainerStyle = {
  display: 'grid',
  gap: '1.5rem',
};

const postCardStyle = {
  backgroundColor: '#f8f9fa',
  padding: '1.5rem',
  borderRadius: '8px',
};

const contentPreviewStyle = {
  color: '#555',
  marginTop: '0.5rem',
};

const metaStyle = {
  display: 'flex',
  gap: '1rem',
  marginTop: '1rem',
  fontSize: '0.9rem',
  color: '#777',
};

/* (your snippet styles assumed already exist) */
const actionsStyle = {
  display: 'flex',
  gap: '0.5rem',
  marginTop: '1rem',
};

const editButtonStyle = {
  padding: '0.5rem 1rem',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const deleteButtonStyle = {
  padding: '0.5rem 1rem',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const paginationStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '2rem',
};

const paginationButtonStyle = {
  padding: '0.5rem 1rem',
  border: '1px solid #ccc',
  backgroundColor: 'white',
  cursor: 'pointer',
};

const pageInfoStyle = {
  fontSize: '0.9rem',
};

const emptyStateStyle = {
  textAlign: 'center',
  padding: '3rem',
  color: '#666',
};

const errorStyle = {
  backgroundColor: '#f8d7da',
  color: '#721c24',
  padding: '1rem',
  marginBottom: '1rem',
  borderRadius: '5px',
};

const loadingStyle = {
  textAlign: 'center',
  padding: '2rem',
};