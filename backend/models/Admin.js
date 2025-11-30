import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  loginCodes: [{
    code: String,
    expiresAt: Date,
    used: { type: Boolean, default: false }
  }]
}, {
  timestamps: true
});

// Clean up expired codes every time we save
adminSchema.pre('save', function(next) {
  const now = new Date();
  this.loginCodes = this.loginCodes.filter(loginCode => loginCode.expiresAt > now);
  next();
});

export default mongoose.model('Admin', adminSchema);