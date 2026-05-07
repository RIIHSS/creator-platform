import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import connectDB from './config/database.js';
import app from './app.js'; // ✅ Import the app logic

// Load environment variables 
dotenv.config();

// Connect to database
connectDB();

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

// Make io accessible globally so app.js can find it
global.io = io;

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
    console.log(`✅ User connected: ${socket.id} | User: ${socket.user?.id}`);
    socket.on('disconnect', (reason) => {
        console.log(`❌ User disconnected: ${socket.id} (${reason})`);
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