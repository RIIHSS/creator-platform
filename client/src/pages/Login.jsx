import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api'; // ✅ added API utility

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    if (apiError) setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // ✅ MERGED PART: using api utility instead of fetch
      const response = await api.post('/api/auth/login', {
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });

      const data = response.data;

      // success
      login(data.user, data.token);

      setFormData({ email: '', password: '' });
      navigate('/dashboard');
    } catch (error) {
      console.error(error);

      // safer error handling for axios-style responses
      setApiError(
        error?.response?.data?.message ||
        'Unable to connect to server'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h1 style={titleStyle}>Welcome Back</h1>
        <p style={subtitleStyle}>Login to your account</p>

        {apiError && (
          <div style={errorMessageStyle}>{apiError}</div>
        )}

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              style={errors.email ? inputErrorStyle : inputStyle}
              disabled={isLoading}
            />
            {errors.email && (
              <span style={errorTextStyle}>{errors.email}</span>
            )}
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              style={errors.password ? inputErrorStyle : inputStyle}
              disabled={isLoading}
            />
            {errors.password && (
              <span style={errorTextStyle}>{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            style={isLoading ? buttonDisabledStyle : buttonStyle}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={linkTextStyle}>
          Don’t have an account?{' '}
          <Link to="/register" style={linkStyle}>
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

// Styles (unchanged)
const containerStyle = {
  minHeight: '80vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem',
  backgroundColor: '#f8f9fa',
};

const formContainerStyle = {
  maxWidth: '400px',
  width: '100%',
  padding: '2.5rem',
  backgroundColor: 'white',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
};

const titleStyle = { textAlign: 'center', marginBottom: '0.5rem' };
const subtitleStyle = { textAlign: 'center', marginBottom: '2rem', color: '#666' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '1.2rem' };
const fieldStyle = { display: 'flex', flexDirection: 'column' };
const labelStyle = { marginBottom: '0.3rem' };

const inputStyle = {
  padding: '0.7rem',
  border: '1px solid #ccc',
  borderRadius: '5px',
};

const inputErrorStyle = {
  ...inputStyle,
  borderColor: 'red',
};

const errorTextStyle = {
  color: 'red',
  fontSize: '0.8rem',
};

const buttonStyle = {
  padding: '0.8rem',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const buttonDisabledStyle = {
  ...buttonStyle,
  backgroundColor: '#999',
};

const errorMessageStyle = {
  backgroundColor: '#f8d7da',
  padding: '0.8rem',
  marginBottom: '1rem',
};

const linkTextStyle = {
  textAlign: 'center',
  marginTop: '1rem',
};

const linkStyle = {
  color: '#007bff',
};

export default Login;