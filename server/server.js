import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import timingMiddleware from './middleware/timing.js'; // ✅ Added import

// Config & Database
import connectDB from './config/database.js';

// Routes
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import uploadRoutes from './routes/upload.js';

// Load environment variables 
dotenv.config();

// Connect to database
connectDB();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

// ==========================================
// ☁️ CLOUDINARY CONFIGURATION
// ==========================================
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// ==========================================
// 🔌 SOCKET.IO SETUP
// ==========================================
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error: No token provided'));

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded; 
        next();
    } catch (err) {
        next(new Error('Authentication error: Invalid or expired token'));
    }
});

io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.id} | User: ${socket.user?.id || socket.user?._id}`);
    socket.on('disconnect', (reason) => {
        console.log(`❌ User disconnected: ${socket.id} (${reason})`);
    });
});

// ==========================================
// 🛠️ MIDDLEWARE
// ==========================================
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
}));
app.use(express.json());

// ✅ Added timingMiddleware BEFORE the routes
app.use(timingMiddleware);

// ==========================================
// 🚀 API ROUTES
// ==========================================
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/posts', postRoutes(io));

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        message: 'Server is running.',
        timestamp: new Date(),
        database: 'Connected'
    });
});

// ==========================================
// 🏁 START SERVER
// ==========================================
httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🔌 Socket.io ready for connections`);
    console.log(`☁️ Cloudinary configured and ready`);
});