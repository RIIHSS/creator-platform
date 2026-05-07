import express from 'express';
import cors from 'cors';
import timingMiddleware from './middleware/timing.js';

// Route Imports
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import uploadRoutes from './routes/upload.js';

const app = express();

// ==========================================
// 🛠️ MIDDLEWARE
// ==========================================
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(timingMiddleware);

// ==========================================
// 🚀 ROUTES
// ==========================================
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);



app.use('/api/posts', postRoutes(global.io || { emit: () => {} }));

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        message: 'Server is running.',
        timestamp: new Date(),
        database: 'Connected'
    });
});


export default app;