import { useState, useEffect } from 'react';

const ImageUpload = ({ onUpload }) => {
  // --- STATE ---
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');

  // --- FUNCTIONS ---
  
  // Step 4: Validation
  const validateFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return 'Please select an image file (JPEG, PNG, WebP, or GIF)';
    }

    if (file.size > maxSizeInBytes) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      return `File is too large (Max 5MB). Your file is ${fileSizeMB}MB`;
    }

    return null;
  };

  // Step 3: Change Handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError('');
    
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    setSelectedFile(file);
    
    // Revoke old URL before creating a new one (Step 7 logic)
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  // Step 8: Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile); 

    if (onUpload) {
      onUpload(formData);
    }
  };

  // --- USEEFFECT (CLEANUP) ---
  // Step 7: Memory Management
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // --- JSX ---
  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>Post Image</label>
        
        {/* Step 3: File Input */}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          style={inputStyle}
        />

        {/* Step 5: Conditional Error Rendering */}
        {error && <p style={errorStyle}>⚠️ {error}</p>}

        {/* Step 4: Image Preview */}
        {previewUrl && (
          <div style={previewContainerStyle}>
            <img src={previewUrl} alt="Preview" style={imagePreviewStyle} />
            <p style={fileNameStyle}>{selectedFile?.name}</p>
          </div>
        )}

        {/* Step 9: Submit Button */}
        <button
          type="submit"
          disabled={!selectedFile || !!error}
          style={!selectedFile || !!error ? disabledButtonStyle : uploadButtonStyle}
        >
          Upload Image
        </button>
      </form>
    </div>
  );
};

/* ================= STYLES ================= */
const containerStyle = { marginBottom: '1.5rem', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff' };
const labelStyle = { display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' };
const inputStyle = { display: 'block', width: '100%', marginBottom: '1rem' };
const errorStyle = { color: 'red', fontSize: '0.9rem', marginBottom: '1rem' };
const previewContainerStyle = { marginBottom: '1rem', textAlign: 'center' };
const imagePreviewStyle = { maxWidth: '100%', maxHeight: '200px', borderRadius: '4px', border: '1px solid #eee' };
const fileNameStyle = { fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' };
const uploadButtonStyle = { padding: '0.5rem 1rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };
const disabledButtonStyle = { ...uploadButtonStyle, backgroundColor: '#ccc', cursor: 'not-allowed' };

export default ImageUpload;