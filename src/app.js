import express from 'express';
import userRoutes from './routes/userRoutes.js';
import oauthRoutes from './routes/oauthRoutes.js';
import cors from 'cors';

const app = express();

// ⬅️ FIX: Configure CORS properly for OAuth flow
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add request logging for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.query);
  next();
});

app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/oauth', oauthRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export default app;