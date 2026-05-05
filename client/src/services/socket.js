import { io } from 'socket.io-client';

// Server URL
const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create socket instance (not connected yet)
const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
  // Using a callback ensures we get a fresh token every time 
  // it connects or reconnects!
  auth: (cb) => {
    // Make sure 'token' matches the exact key you used when saving to localStorage
    const token = localStorage.getItem('token'); 
    cb({ token });
  }
});

export default socket;
