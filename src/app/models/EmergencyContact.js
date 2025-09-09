import mongoose from "mongoose";

const emergencyContactSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient is required']
  },
  contactType: {
    type: String,
    enum: {
      values: ['primary', 'secondary'],
      message: 'Contact type must be primary or secondary'
    },
    default: 'primary'
  },
  name: {
    type: String,
    required: [true, 'Contact name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
relationship: {
    type: String,
    required: [true, 'Relationship is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\+?[\d\s-()]{10,15}$/, 'Please enter a valid phone number']
  },
  alternatePhone: {
    type: String,
    match: [/^\+?[\d\s-()]{10,15}$/, 'Please enter a valid alternate phone number']
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const EmergencyContact = mongoose.model("EmergencyContact", emergencyContactSchema);

export default EmergencyContact;