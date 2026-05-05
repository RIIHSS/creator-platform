import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ImageUpload from '../components/ImageUpload';
import toast from 'react-hot-toast';

const CreatePost = () => {
  // ✅ formData initialized with null for coverImage (Step 7)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Technology',
    status: 'draft',
    coverImage: null,  
  });

  const [isLoading, setIsLoading] = useState(false);        // setSubmitting equivalent
  const [isImageUploading, setIsImageUploading] = useState(false); 
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
  // HANDLE IMAGE UPLOAD (Lesson 4.7 Pattern)
  // ==========================================
  const handleImageUpload = async (imageFormData) => {
    setIsImageUploading(true);
    setError('');

    try {
      const response = await api.post('/api/upload', imageFormData);
      
      // Update state with the Cloudinary URL
      setFormData(prev => ({
        ...prev,
        coverImage: response.data.url
      }));

      toast.success('Image uploaded successfully!');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Image upload failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsImageUploading(false);
    }
  };

  // ==========================================
  // ✅ STEP 7: HANDLE POST SUBMISSION
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Basic validation (Step 7)
    if (!formData.title || !formData.content) {
      toast.error('Title and content are required');
      return;
    }

    // Guard: Prevent saving post if image is still in transit
    if (isImageUploading) {
      return toast.error('Please wait for image to finish uploading');
    }

    setIsLoading(true); // Step 7: setSubmitting(true)
    setError('');

    try {
      // 2. Prepare postData (Step 7)
      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category,
        status: formData.status,
        coverImage: formData.coverImage // This is null if no image was uploaded
      };

      // 3. Send POST request
      await api.post('/api/posts', postData);

      // 4. Success handling
      toast.success('Post created successfully!');

      // 5. Reset the form (Step 7)
      setFormData({
        title: '',
        content: '',
        category: 'Technology',
        status: 'draft',
        coverImage: null
      });

      // 6. Navigate (Step 7)
      navigate('/dashboard');

    } catch (err) {
      // Step 7: Error handling pattern
      const message = err?.response?.data?.message || 'Failed to create post';
      setError(message);
      toast.error(message);
    } finally {
      // Step 7: finally block runs regardless of success or failure
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
            <label>Featured Image (Optional)</label>
            <ImageUpload onUpload={handleImageUpload} />
            
            {isImageUploading && (
              <p style={{ color: '#007bff', fontSize: '0.85rem' }}>⏳ Uploading to Cloudinary...</p>
            )}

            {formData.coverImage && !isImageUploading && (
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
            {isLoading ? 'Creating...' : 'Create Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Styles
const containerStyle = { minHeight: '80vh', display: 'flex', justifyContent: 'center', padding: '2rem', backgroundColor: '#f8f9fa' };
const formContainerStyle = { width: '100%', maxWidth: '600px', backgroundColor: '#fff', padding: '2rem', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '1rem' };
const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '0.5rem' };
const inputStyle = { padding: '0.7rem', borderRadius: '5px', border: '1px solid #ccc' };
const textareaStyle = { ...inputStyle, resize: 'vertical' };
const buttonStyle = { padding: '0.8rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' };
const errorStyle = { backgroundColor: '#f8d7da', color: '#721c24', padding: '0.8rem', marginBottom: '1rem', borderRadius: '5px' };

export default CreatePost;