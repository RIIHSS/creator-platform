import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import socket from '../services/socket';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, logout, loading } = useAuth();

  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // ==========================================
  // EFFECT 1: Socket.IO Connection & Listeners
  // ==========================================
  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      console.log('🔌 Socket connected:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket auth error:', error.message);
    });

    socket.on('newPost', (data) => {
      toast.success(data.message);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('newPost');
      socket.disconnect();
    };
  }, []);

  // ==========================================
  // EFFECT 2: Load Posts from API
  // ==========================================
  useEffect(() => {
    if (!user) return; 

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
  }, [currentPage, user]);

  // ==========================================
  // HANDLERS
  // ==========================================
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleDelete = async (postId) => {
    try {
      await api.delete(`/api/posts/${postId}`);
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      toast.success('Post deleted successfully');
    } catch (err) {
      setError('Failed to delete post');
      console.error(err);
    }
  };

  if (loading) return <div style={loadingStyle}>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

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
            <button style={createButtonStyle}>+ Create New Post</button>
          </Link>
          <button onClick={logout} style={logoutButtonStyle}>Logout</button>
        </div>
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      {/* POSTS LIST */}
      {isLoading ? (
        <div style={loadingStyle}>Loading posts...</div>
      ) : (
        <div style={postsContainerStyle}>
          {posts.length === 0 ? (
            <div style={emptyStateStyle}>
              <p>You haven't created any posts yet.</p>
              <Link to="/create">Create your first post</Link>
            </div>
          ) : (
            <>
              {posts.map((post) => (
                <div key={post._id} style={postCardStyle}>
                  
                  {/* ========================================== */}
                  {/* ✅ STEP 8: Render Cover Image Conditionally */}
                  {/* ========================================== */}
                  {post.coverImage && (
                    <img
                      src={post.coverImage}
                      alt={`Cover image for ${post.title}`}
                      style={postImageStyle}
                    />
                  )}

                  <div style={cardBodyStyle}>
                    <h3>{post.title}</h3>
                    <p style={contentPreviewStyle}>{post.content.substring(0, 150)}...</p>
                    
                    <div style={metaStyle}>
                      <span>{post.category}</span>
                      <span>{post.status}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div style={actionsStyle}>
                      <Link to={`/edit/${post._id}`}>
                        <button style={editButtonStyle}>Edit</button>
                      </Link>
                      <button onClick={() => handleDelete(post._id)} style={deleteButtonStyle}>
                        Delete
                      </button>
                    </div>
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
                  Page {pagination.page} of {pagination.totalPages} ({pagination.total} posts)
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
const containerStyle = { minHeight: '80vh', padding: '2rem', maxWidth: '1200px', margin: '0 auto' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' };
const createButtonStyle = { padding: '0.5rem 1.5rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const logoutButtonStyle = { padding: '0.5rem 1.5rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };

// Updated to grid layout to look better with images
const postsContainerStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' };

const postCardStyle = { 
  backgroundColor: '#f8f9fa', 
  borderRadius: '8px', 
  overflow: 'hidden', // Ensures image corners follow card radius
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
};

const cardBodyStyle = { padding: '1.5rem' };

// ✅ Added Image Styles from Step 8
const postImageStyle = { 
  width: '100%', 
  maxHeight: '200px', 
  objectFit: 'cover' 
};

const contentPreviewStyle = { color: '#555', marginTop: '0.5rem' };
const metaStyle = { display: 'flex', gap: '1rem', marginTop: '1rem', fontSize: '0.8rem', color: '#777' };
const actionsStyle = { display: 'flex', gap: '0.5rem', marginTop: '1rem' };
const editButtonStyle = { padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const deleteButtonStyle = { padding: '0.5rem 1rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const paginationStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', gridColumn: '1 / -1' };
const paginationButtonStyle = { padding: '0.5rem 1rem', border: '1px solid #ccc', backgroundColor: 'white', cursor: 'pointer' };
const pageInfoStyle = { fontSize: '0.9rem' };
const emptyStateStyle = { textAlign: 'center', padding: '3rem', color: '#666', gridColumn: '1 / -1' };
const errorStyle = { backgroundColor: '#f8d7da', color: '#721c24', padding: '1rem', marginBottom: '1rem', borderRadius: '5px' };
const loadingStyle = { textAlign: 'center', padding: '2rem' };