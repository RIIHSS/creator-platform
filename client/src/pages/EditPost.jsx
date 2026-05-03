import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Technology',
    status: 'draft'
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchPost = async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await api.get(`/api/posts/${id}`);
        const post = response.data.data;

        if (isMounted && post) {
          setFormData({
            title: post.title || '',
            content: post.content || '',
            category: post.category || 'Technology',
            status: post.status || 'draft'
          });
        }

      } catch (err) {
        if (isMounted) {
          setError(err?.response?.data?.message || 'Failed to load post');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchPost();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setIsSaving(true);

    if (formData.content.trim().length < 10) {
      setError('Content must be at least 10 characters');
      setIsSaving(false);
      return;
    }

    try {
      const response = await api.put(`/api/posts/${id}`, {
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category,
        status: formData.status
      });

      if (response.data?.success) {
        navigate('/dashboard');
      } else {
        setError(response.data?.message || 'Failed to update post');
      }

    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update post');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div style={loadingStyle}>Loading post...</div>;
  }

  if (error && !formData.title) {
    return <div style={errorPageStyle}>{error}</div>;
  }

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h1>Edit Post</h1>

        {error && <div style={errorStyle}>{error}</div>}

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={fieldStyle}>
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={isSaving}
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label>Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="10"
              required
              disabled={isSaving}
              style={textareaStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={isSaving}
              style={inputStyle}
            >
              <option value="Technology">Technology</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Travel">Travel</option>
              <option value="Food">Food</option>
            </select>
          </div>

          <div style={fieldStyle}>
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={isSaving}
              style={inputStyle}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div style={buttonGroupStyle}>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              disabled={isSaving}
              style={cancelButtonStyle}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              style={submitButtonStyle}
            >
              {isSaving ? 'Saving...' : 'Update Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;

/* ================= STYLES ================= */

const containerStyle = {
  minHeight: '80vh',
  display: 'flex',
  justifyContent: 'center',
  padding: '2rem',
  backgroundColor: '#f8f9fa'
};

const formContainerStyle = {
  width: '100%',
  maxWidth: '600px',
  backgroundColor: '#fff',
  padding: '2rem',
  borderRadius: '10px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
};

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column'
};

const inputStyle = {
  padding: '0.7rem',
  borderRadius: '5px',
  border: '1px solid #ccc'
};

const textareaStyle = {
  ...inputStyle,
  resize: 'vertical'
};

const buttonGroupStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '1rem'
};

const cancelButtonStyle = {
  padding: '0.7rem 1.5rem',
  backgroundColor: '#6c757d',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};

const submitButtonStyle = {
  padding: '0.7rem 1.5rem',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};

const errorStyle = {
  backgroundColor: '#f8d7da',
  color: '#721c24',
  padding: '1rem',
  marginBottom: '1rem',
  borderRadius: '5px'
};

const errorPageStyle = {
  textAlign: 'center',
  padding: '3rem',
  color: 'red'
};

const loadingStyle = {
  textAlign: 'center',
  padding: '2rem'
};