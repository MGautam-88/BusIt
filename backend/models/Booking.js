import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true
  },
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: true
  },
  // Legacy single-passenger fields (kept for backward compatibility)
  passengerName: {
    type: String,
    trim: true
  },
  passengerAge: {
    type: Number
  },
  passengerGender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  // New: per-passenger details
  passengers: [{
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    seatNumber: { type: Number, required: true }
  }],
  seatNumbers: [{
    type: Number,
    required: true
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  bookingStatus: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  journeyDate: {
    type: Date,
    required: true
  },
  pnr: {
    type: String,
    unique: true,
    required: true
  }
});

bookingSchema.index({ user: 1, bookingDate: -1 });

export default mongoose.model('Booking', bookingSchema);
