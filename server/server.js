const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Trust proxy - important for HTTPS behind nginx/load balancer
app.set('trust proxy', 1);

// Frontend URL for proxying
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Allowed origins for CORS
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5000',
    'https://portfolio-builder.app.viralix.dev',
    FRONTEND_URL
];

// Enable CORS - must be before other middleware
app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(null, true); // Allow all origins in production behind nginx
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

// Body parser
app.use(express.json());

// Route files
const authRoutes = require('./routes/auth');
const portfolioRoutes = require('./routes/portfolios');
const resumeRoutes = require('./routes/resume');

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/resume', resumeRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});

// Error handler for API routes
app.use('/api', errorHandler);

// Handle 404 for API routes only
app.use('/api', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API route not found',
    });
});

// Proxy all non-API requests to Next.js frontend
app.use(
    '*',
    createProxyMiddleware({
        target: FRONTEND_URL,
        changeOrigin: true,
        ws: true, // Enable WebSocket proxying for HMR
        logLevel: 'warn',
    })
);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});
