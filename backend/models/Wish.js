import mongoose from 'mongoose';

const wishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 30
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  date: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

wishSchema.index({ date: -1 });

export default mongoose.model('Wish', wishSchema);
