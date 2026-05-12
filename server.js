/**
 * Agriconnect Backend Server
 * Production-ready Express.js application with MariaDB, JWT auth, and Gemini AI
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { testConnection } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboard');
const farmerRoutes = require('./routes/farmerRoutes');
const buyerRoutes = require('./routes/buyerRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const fraRoutes = require('./routes/fraRoutes');
const cooperativeRoutes = require('./routes/cooperativeRoutes');
const adminRoutes = require('./routes/adminRoutes');
const geminiRoutes = require('./routes/geminiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
let server;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: NODE_ENV === 'production' ? undefined : false
}));

// CORS configuration
const allowedOrigins = new Set([
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
]);

const isAllowedDevOrigin = (origin) => {
  // In development, allow localhost/127.0.0.1 from any port (e.g. Vite fallback ports)
  if (NODE_ENV !== 'development') return false;
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
};

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (curl/postman) and whitelisted frontends
    if (!origin || allowedOrigins.has(origin) || isAllowedDevOrigin(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// Stricter rate limit for AI endpoints (Gemini API costs)
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 AI requests per minute per IP
  message: {
    success: false,
    message: 'AI request limit reached. Please wait a moment.'
  }
});
app.use('/api/gemini-advice', aiLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
app.use('/api', require('./routes/paymentRoutes'));
app.use('/api/farmer', require('./routes/farmerOrderRoutes'));
  res.status(200).json({
    success: true,
    message: 'Agriconnect API is running',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/buyers', buyerRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/fra', fraRoutes);
app.use('/api/cooperatives', cooperativeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/gemini-advice', geminiRoutes);

// 404 handler
app.use('/api/products', require('./routes/productRoutes'));
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use(errorHandler);

// Database connection and server start
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('❌ Failed to connect to database. Server will not start.');
      process.exit(1);
    }

    // Start server
    server = app.listen(PORT, () => {
      console.log(`
🌾 ===========================================
🌾  Agriconnect API Server
🌾  Environment: ${NODE_ENV}
🌾  Port: ${PORT}
🌾  Database: MariaDB
🌾  AI Integration: Gemini API
🌾 ===========================================
      `);
      
      console.log('📚 Available endpoints:');
      console.log('   • POST /api/auth/register');
      console.log('   • POST /api/auth/login');
      console.log('   • GET  /api/dashboard');
      console.log('   • GET  /api/dashboard/market-prices');
      console.log('   • GET  /api/dashboard/profile');
      console.log('   • PUT  /api/dashboard/profile');
      console.log('   • POST /api/gemini-advice/advice (AI-powered)');
      console.log('   • GET  /health');
    });

  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully...');
  if (server) {
    server.close(() => {
      console.log('💥 Process terminated!');
    });
  }
});

startServer();

module.exports = app;
