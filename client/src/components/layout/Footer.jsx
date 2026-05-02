const Footer = () => {
  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <p>&copy; 2024 {/* YOUR PLATFORM NAME */}cri8tor. All rights reserved.</p>
        <p>Built by {/* YOUR NAME */}Risshi</p>
      </div>
    </footer>
  );
};

const footerStyle = {
  backgroundColor: '#333',
  color: 'white',
  padding: '2rem 0',
  marginTop: 'auto',
  textAlign: 'center',
};

const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 2rem',
};

export default Footer;