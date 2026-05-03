import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        {/* Logo */}
        <h1 style={logoStyle}>
          <Link to="/" style={logoLinkStyle}>
            Creator Platform
          </Link>
        </h1>

        {/* Navigation */}
        <nav style={navStyle}>
          <Link to="/" style={navLinkStyle}>Home</Link>

          {isAuthenticated() ? (
            <>
              <Link to="/dashboard" style={navLinkStyle}>Dashboard</Link>
              <span style={userNameStyle}>Hi, {user?.name}</span>
              <button onClick={logout} style={logoutBtnStyle}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={navLinkStyle}>Login</Link>
              <Link to="/register" style={navLinkStyle}>Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

// Styles
const headerStyle = {
  backgroundColor: '#333',
  color: 'white',
  padding: '1rem 0',
};

const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 2rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const logoStyle = {
  margin: 0,
  fontSize: '1.5rem',
};

const logoLinkStyle = {
  color: 'white',
  textDecoration: 'none',
  fontWeight: 'bold',
};

const navStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1.5rem',
};

const navLinkStyle = {
  color: 'white',
  textDecoration: 'none',
};

const userNameStyle = {
  color: '#ddd',
  fontSize: '0.9rem',
};

const logoutBtnStyle = {
  padding: '0.4rem 0.9rem',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default Header;