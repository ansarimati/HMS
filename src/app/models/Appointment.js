import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  appointmentId: {
    type: String,
    required: [true, 'Appointment ID is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient is required']
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'Doctor is required']
  },
  appointmentDate: {
    type: Date,
    required: [true, 'Appointment date is required'],
    validate: {
      validator: function(date) {
        return date >= new Date().setHours(0, 0, 0, 0);
      },
      message: 'Appointment date cannot be in the past'
    }
  },
  appointmentTime: {
    type: String,
    required: [true, 'Appointment time is required'],
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [15, 'Duration must be at least 15 minutes'],
    max: [240, 'Duration cannot exceed 240 minutes']
  },
appointmentType: {
    type: String,
    required: [true, 'Appointment type is required'],
    enum: {
      values: ['consultation', 'follow-up', 'emergency', 'routine-checkup'],
      message: 'Invalid appointment type'
    }
  },
  status: {
    type: String,
    enum: {
      values: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
      message: 'Invalid appointment status'
    },
    default: 'scheduled'
  },
  reason: {
    type: String,
    required: [true, 'Reason for appointment is required'],
    trim: true,
    minlength: [10, 'Reason must be at least 10 characters']
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  consultationFee: {
    type: Number,
    required: [true, 'Consultation fee is required'],
    min: [0, 'Consultation fee cannot be negative']
  },
  paymentStatus: {
    type: String,
    enum: {
      values: ['pending', 'paid', 'partial', 'refunded'],
      message: 'Invalid payment status'
    },
    default: 'pending'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Created by is required']
  }
}, {
  timestamps: true
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;