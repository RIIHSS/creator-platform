import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout, loading } = useAuth();

  // Loading state (prevents flicker)
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        Loading...
      </div>
    );
  }

  // Not logged in → redirect
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, {user.name}!</p>
        </div>

        <button onClick={logout} style={logoutButtonStyle}>
          Logout
        </button>
      </div>

      <div style={contentStyle}>
        <div style={cardStyle}>
          <h2>Your Account</h2>
          <div style={infoStyle}>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p>
              <strong>Member Since:</strong>{' '}
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : 'N/A'}
            </p>
          </div>
        </div>

        <div style={cardStyle}>
          <h2>Your Dashboard</h2>
          <p>This page will display:</p>
          <ul style={listStyle}>
            <li>Your created content</li>
            <li>Statistics and analytics</li>
            <li>Quick actions (create, edit, delete)</li>
            <li>Recent activity</li>
          </ul>
          <p style={noteStyle}>
            This will be expanded as you build more features
          </p>
        </div>
      </div>
    </div>
  );
};

// Styles
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

const logoutButtonStyle = {
  padding: '0.5rem 1.5rem',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const contentStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '2rem',
};

const cardStyle = {
  backgroundColor: '#f8f9fa',
  padding: '2rem',
  borderRadius: '8px',
};

const infoStyle = {
  marginTop: '1rem',
  lineHeight: '2',
};

const listStyle = {
  paddingLeft: '1.5rem',
  marginTop: '1rem',
};

const noteStyle = {
  marginTop: '1rem',
  fontStyle: 'italic',
  color: '#666',
};

export default Dashboard;