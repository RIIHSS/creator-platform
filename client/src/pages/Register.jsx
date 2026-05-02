import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [apiError, setApiError] = useState('');

  const navigate = useNavigate();

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // ✅ VALIDATION FUNCTION (your code)
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Name cannot exceed 50 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ SUBMIT HANDLER (your code, cleaned)
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage('');
    setApiError('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const registrationData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      };

      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Account created successfully! Redirecting...');

        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });

        setTimeout(() => navigate('/login'), 2000);
      } else {
        setApiError(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error(error);
      setApiError('Server error. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h1 style={titleStyle}>Create Account</h1>
        <p style={subtitleStyle}>Join cri8tor today</p>

        {successMessage && <div style={successStyle}>{successMessage}</div>}
        {apiError && <div style={errorBoxStyle}>{apiError}</div>}

        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            style={errors.name ? inputErrorStyle : inputStyle}
          />
          {errors.name && <p style={errorText}>{errors.name}</p>}

          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={errors.email ? inputErrorStyle : inputStyle}
          />
          {errors.email && <p style={errorText}>{errors.email}</p>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={errors.password ? inputErrorStyle : inputStyle}
          />
          {errors.password && <p style={errorText}>{errors.password}</p>}

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            style={errors.confirmPassword ? inputErrorStyle : inputStyle}
          />
          {errors.confirmPassword && (
            <p style={errorText}>{errors.confirmPassword}</p>
          )}

          <button disabled={isLoading} style={buttonStyle}>
            {isLoading ? 'Creating...' : 'Register'}
          </button>
        </form>

        <p style={linkTextStyle}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

// Styles
const containerStyle = { display: 'flex', justifyContent: 'center', marginTop: '50px' };
const formContainerStyle = { width: '350px' };
const formStyle = { display: 'flex', flexDirection: 'column' };
const inputStyle = { margin: '5px 0', padding: '8px' };
const inputErrorStyle = { ...inputStyle, border: '1px solid red' };
const buttonStyle = { marginTop: '10px', padding: '10px' };
const errorText = { color: 'red', fontSize: '12px' };
const errorBoxStyle = { background: '#fdd', padding: '10px' };
const successStyle = { background: '#dfd', padding: '10px' };
const titleStyle = { textAlign: 'center' };
const subtitleStyle = { textAlign: 'center', marginBottom: '10px' };
const linkTextStyle = { textAlign: 'center', marginTop: '10px' };

export default Register;