import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken'; // ✅ Added JWT import

// Load environment variables 
dotenv.config();

// Connect to database
connectDB();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
}));
app.use(express.json());

const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// ✅ Added Socket.IO Authentication Middleware
io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        return next(new Error('Authentication error: No token provided'));
    }

    try {
        // Verify the token using your secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded user payload to the socket object
        socket.user = decoded; 

        // Token is valid, allow the connection
        next();
    } catch (err) {
        console.error('Socket JWT Error:', err.message);
        next(new Error('Authentication error: Invalid or expired token'));
    }
});

// Socket connection handling
io.on('connection', (socket) => {
    // ✅ You can now access socket.user here because it passed the middleware!
    console.log(`✅ User connected: ${socket.id} | (User ID: ${socket.user.userId})`);

    socket.on('disconnect', (reason) =>{
        console.log(`❌ User disconnected: ${socket.id} (${reason})`);
    });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes(io));

// Health check endpoint (keep for testing)
app.get('/api/health', (req, res) => {
    res.json({
        message: 'Server is running.',
        timestamp: new Date(),
        database: 'Connected'
    });
});

// Start server 
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔌 Socket.io ready for connections`);
});