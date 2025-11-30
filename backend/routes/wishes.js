import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Wish from '../models/Wish.js';
import Admin from '../models/Admin.js';
import { sendLoginCode } from '../services/emailService.js';
import { authenticateAdmin } from '../middleware/auth.js';

dotenv.config();

const router = express.Router();

function generateLoginCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// DEBUG: Check database connection
router.get('/debug', async (req, res) => {
  try {
    const wishCount = await Wish.countDocuments();
    const adminCount = await Admin.countDocuments();
    
    res.json({
      database: 'Connected',
      wishes: wishCount,
      admins: adminCount,
      adminEmail: process.env.ADMIN_EMAIL
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initialize admin (FIRST TIME SETUP)
router.post('/admin/init', async (req, res) => {
  try {
    // Clear existing
    await Admin.deleteMany({});
    
    // Create new admin
    const admin = new Admin({
      email: process.env.ADMIN_EMAIL,
      password: 'temp-password-123',
      loginCodes: []
    });
    
    await admin.save();
    
    console.log('✅ Admin initialized');
    res.json({ 
      success: true,
      message: 'Admin initialized successfully'
    });
  } catch (error) {
    console.error('❌ Init error:', error);
    res.status(500).json({ error: 'Init failed: ' + error.message });
  }
});

// Admin login - SIMPLIFIED
router.post('/admin/login', async (req, res) => {
  try {
    console.log('📧 Login request:', req.body);
    
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    // Check admin email
    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ error: 'Access denied' });
    }

    // Generate code
    const loginCode = generateLoginCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Find or create admin
    let admin = await Admin.findOne({ email });
    if (!admin) {
      admin = new Admin({
        email: email,
        password: 'temp-password',
        loginCodes: []
      });
    }

    // Add new code
    admin.loginCodes.push({ 
      code: loginCode, 
      expiresAt,
      used: false 
    });
    
    await admin.save();

    // Try to send email
    let emailSent = false;
    try {
      emailSent = await sendLoginCode(email, loginCode);
    } catch (emailError) {
      console.log('📧 Email failed, using fallback');
    }

    // Always return code for testing
    res.json({ 
      success: true,
      message: emailSent ? 'Code sent to email' : 'Check response for code',
      code: loginCode, // Remove in production
      email: email
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Verify code
router.post('/admin/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body;
    console.log('🔐 Verifying code:', { email, code });

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ error: 'Admin not found' });
    }

    const now = new Date();
    const validCode = admin.loginCodes.find(
      loginCode => loginCode.code === code && 
                   loginCode.expiresAt > now && 
                   !loginCode.used
    );

    if (validCode) {
      // Mark as used
      validCode.used = true;
      await admin.save();

      // Generate token
      const token = jwt.sign(
        { email: admin.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({ 
        success: true,
        token: token,
        message: 'Login successful!'
      });
    } else {
      res.status(401).json({ error: 'Invalid or expired code' });
    }
  } catch (error) {
    console.error('❌ Verify error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get wishes
router.get('/', async (req, res) => {
  try {
    const wishes = await Wish.find()
      .select('name message date')
      .sort({ date: -1 })
      .limit(100);
    
    res.json(wishes);
  } catch (error) {
    console.error('❌ Get wishes error:', error);
    res.status(500).json({ error: 'Failed to fetch wishes' });
  }
});

// Submit wish - FIXED
router.post('/', async (req, res) => {
  try {
    const { name, message } = req.body;
    
    console.log('📝 New wish submission:', { name, message });

    if (!name?.trim() || !message?.trim()) {
      return res.status(400).json({ error: 'Name and message required' });
    }

    // Create wish
    const wish = new Wish({
      name: name.trim().substring(0, 30),
      message: message.trim().substring(0, 200),
      ipAddress: req.ip || 'unknown'
    });

    await wish.save();
    
    console.log('✅ Wish saved:', wish._id);
    
    res.status(201).json({
      id: wish._id,
      name: wish.name,
      message: wish.message,
      date: wish.date
    });
    
  } catch (error) {
    console.error('❌ Submit error:', error);
    res.status(500).json({ error: 'Failed to save wish: ' + error.message });
  }
});

// Delete wish
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const wish = await Wish.findByIdAndDelete(req.params.id);
    if (!wish) {
      return res.status(404).json({ error: 'Wish not found' });
    }
    
    res.json({ message: 'Wish deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
