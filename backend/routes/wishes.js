import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Wish from '../models/Wish.js';
import Admin from '../models/Admin.js';
import { sendLoginCode } from '../services/emailService.js';
import { authenticateAdmin } from '../middleware/auth.js';

dotenv.config();

const router = express.Router();

// Generate random 6-digit code
function generateLoginCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Simple email login - no password needed
// Updated login route - NO PASSWORD CHECK
router.post('/admin/login', async (req, res) => {
  try {
    const { email } = req.body;
    
    console.log('📧 Login request for:', email);

    // Check if email matches admin email
    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ error: 'Access denied' });
    }

    // Generate login code
    const loginCode = generateLoginCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save or update admin
    let admin = await Admin.findOne({ email });
    if (!admin) {
      admin = new Admin({
        email: email,
        loginCodes: []
      });
    }

    // Save code
    admin.loginCodes.push({ code: loginCode, expiresAt });
    await admin.save();

    // Send email
    const emailSent = await sendLoginCode(email, loginCode);

    if (emailSent) {
      res.json({ 
        success: true,
        message: 'Login code sent to your email!',
        email: email
      });
    } else {
      // Fallback - show code in console
      console.log('📧 LOGIN CODE:', loginCode);
      res.json({ 
        success: true,
        message: 'Check server console for code: ' + loginCode,
        email: email
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


  router.post('/admin/init', async (req, res) => {
  try {
    await Admin.deleteMany({});
    console.log('✅ Admin initialized');
    res.json({ message: 'Admin ready for login' });
  } catch (error) {
    console.error('Init error:', error);
    res.status(500).json({ error: 'Init failed' });
  }
});


// Verify code and login
router.post('/admin/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body;
    console.log('🔐 Code verification:', { email, code });

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid code' });
    }

    const now = new Date();
    const validCode = admin.loginCodes.find(
      loginCode => loginCode.code === code && 
                   loginCode.expiresAt > now && 
                   !loginCode.used
    );

    if (validCode) {
      // Mark code as used
      validCode.used = true;
      await admin.save();

      // Generate JWT token
      const token = jwt.sign(
        { email: admin.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      console.log('✅ Login successful');
      res.json({ 
        token: token,
        message: 'Login successful!'
      });
    } else {
      res.status(401).json({ error: 'Invalid or expired code' });
    }
  } catch (error) {
    console.error('Code verification error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Other routes remain same...
router.get('/', async (req, res) => {
  try {
    const wishes = await Wish.find().select('name message date').sort({ date: -1 }).limit(100);
    res.json(wishes);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, message } = req.body;
    if (!name?.trim() || !message?.trim()) {
      return res.status(400).json({ error: 'Name and message required' });
    }

    const wish = new Wish({
      name: name.trim(),
      message: message.trim(),
      ipAddress: req.ip
    });

    await wish.save();
    res.status(201).json({
      id: wish._id,
      name: wish.name,
      message: wish.message,
      date: wish.date.toLocaleDateString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const wish = await Wish.findByIdAndDelete(req.params.id);
    if (!wish) return res.status(404).json({ error: 'Wish not found' });
    res.json({ message: 'Wish deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;