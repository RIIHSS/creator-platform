import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ImageUpload from '../components/ImageUpload'; // ✅ Import the component
import toast from 'react-hot-toast';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Technology',
    status: 'draft',
    imageUrl: '',      // ✅ Added to store Cloudinary URL
    imagePublicId: ''  // ✅ Added to store Cloudinary ID
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false); // ✅ Track image upload state
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  // ==========================================
  // ✅ STEP 11: Handle Image Upload
  // ==========================================
  const handleImageUpload = async (imageFormData) => {
    setIsImageUploading(true);
    setError('');

    try {
      // Send the FormData to your server/cloudinary route
      const response = await api.post('/api/upload', imageFormData);
      
      // Update state with the returned Cloudinary data
      setFormData(prev => ({
        ...prev,
        imageUrl: response.data.url,
        imagePublicId: response.data.publicId
      }));

      toast.success('Image uploaded and ready!');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Image upload failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent submission if image is still uploading
    if (isImageUploading) {
      return toast.error('Please wait for image to finish uploading');
    }

    setError('');
    setIsLoading(true);

    try {
      const payload = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category,
        status: formData.status,
        imageUrl: formData.imageUrl,      // ✅ Send the image URL to DB
        imagePublicId: formData.imagePublicId // ✅ Send the ID to DB
      };

      const response = await api.post('/api/posts', payload);

      if (response.data?.success) {
        toast.success('Post created successfully!');
        navigate('/dashboard');
      } else {
        setError(response.data?.message || 'Failed to create post');
      }

    } catch (err) {
      setError(err?.response?.data?.message || 'Server error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h1>Create New Post</h1>

        {error && <div style={errorStyle}>{error}</div>}

        <form onSubmit={handleSubmit} style={formStyle}>
          
          {/* IMAGE UPLOAD SECTION */}
          <div style={fieldStyle}>
            <label>Featured Image</label>
            <ImageUpload onUpload={handleImageUpload} />
            {formData.imageUrl && (
              <p style={{ color: 'green', fontSize: '0.8rem', marginTop: '-10px' }}>
                ✅ Image successfully linked to post
              </p>
            )}
          </div>

          {/* Title */}
          <div style={fieldStyle}>
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter post title"
              required
              disabled={isLoading || isImageUploading}
              style={inputStyle}
            />
          </div>

          {/* Content */}
          <div style={fieldStyle}>
            <label>Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your post content..."
              rows="10"
              required
              disabled={isLoading || isImageUploading}
              style={textareaStyle}
            />
          </div>

          {/* Category */}
          <div style={fieldStyle}>
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={isLoading || isImageUploading}
              style={inputStyle}
            >
              <option value="Technology">Technology</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Travel">Travel</option>
              <option value="Food">Food</option>
            </select>
          </div>

          {/* Status */}
          <div style={fieldStyle}>
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={isLoading || isImageUploading}
              style={inputStyle}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading || isImageUploading}
            style={{
              ...buttonStyle,
              opacity: (isLoading || isImageUploading) ? 0.6 : 1,
              cursor: (isLoading || isImageUploading) ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Creating Post...' : 'Create Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Styles (unchanged from your snippet)
const containerStyle = { minHeight: '80vh', display: 'flex', justifyContent: 'center', padding: '2rem', backgroundColor: '#f8f9fa' };
const formContainerStyle = { width: '100%', maxWidth: '600px', backgroundColor: '#fff', padding: '2rem', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '1rem' };
const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '0.5rem' };
const inputStyle = { padding: '0.7rem', borderRadius: '5px', border: '1px solid #ccc' };
const textareaStyle = { ...inputStyle, resize: 'vertical' };
const buttonStyle = { padding: '0.8rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' };
const errorStyle = { backgroundColor: '#f8d7da', color: '#721c24', padding: '0.8rem', marginBottom: '1rem', borderRadius: '5px' };

export default CreatePost;