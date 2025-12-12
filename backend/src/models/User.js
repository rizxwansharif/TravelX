const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    enum: ['traveler', 'sender', 'both'],
    required: true
  },
  mobileNumber: {
    type: String,
    required: true
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  cnicData: {
    idNumber: String,
    extractedName: String,
    facialEmbedding: [Number]
  },
  profileImage: String,
  rating: {
    type: Number,
    default: 0
  },
  completedDeliveries: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
