import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import wishesRouter from './routes/wishes.js';
import Admin from './models/Admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const initializeAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (!adminExists) {
      console.log('🔄 Auto-creating admin user...');
      // Make a request to initialize admin
      const response = await fetch(`http://localhost:${process.env.PORT}/api/wishes/admin/init`, {
        method: 'POST'
      });
      console.log('✅ Admin auto-creation result:', response.status);
    }
  } catch (error) {
    console.log('⚠️ Admin auto-creation skipped:', error.message);
  }
};

// Call after DB connection
connectDB().then(() => {
  initializeAdmin();
});
// Connect to database
connectDB();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/wishes', wishesRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});