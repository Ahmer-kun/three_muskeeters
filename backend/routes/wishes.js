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

// Initialize admin
router.post('/admin/init', async (req, res) => {
  try {
    await Admin.deleteMany({});
    
    const admin = new Admin({
      email: process.env.ADMIN_EMAIL,
      password: 'temp-password',
      loginCodes: []
    });
    
    await admin.save();
    
    console.log('✅ Admin initialized');
    res.json({ message: 'Admin ready for login' });
  } catch (error) {
    console.error('Init error:', error);
    res.status(500).json({ error: 'Init failed' });
  }
});

// Admin login
router.post('/admin/login', async (req, res) => {
  try {
    const { email } = req.body;
    
    console.log('📧 Login request for:', email);

    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ error: 'Access denied' });
    }

    const loginCode = generateLoginCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    let admin = await Admin.findOne({ email });
    if (!admin) {
      admin = new Admin({
        email: email,
        password: 'temp-password',
        loginCodes: []
      });
    }

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

// Verify code
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
      validCode.used = true;
      await admin.save();

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

// Get wishes
router.get('/', async (req, res) => {
  try {
    const wishes = await Wish.find().select('name message date').sort({ date: -1 }).limit(100);
    res.json(wishes);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit wish
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
      date: wish.date
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete wish
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
