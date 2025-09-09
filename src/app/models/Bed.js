import mongoose from "mongoose";

const bedSchema = new mongoose.Schema({
  bedNumber: {
    type: String,
    required: [true, 'Bed number is required'],
    trim: true
  },
  ward: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ward',
    required: [true, 'Ward is required']
  },
  bedType: {
    type: String,
    required: [true, 'Bed type is required'],
    enum: {
      values: ['general', 'ICU', 'private', 'semi-private'],
      message: 'Invalid bed type'
    }
  },
  isOccupied: {
    type: Boolean,
    default: false
  },
  currentPatient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    validate: {
      validator: function(patientId) {
        // If bed is occupied, patient ID must be provided
        if (this.isOccupied && !patientId) {
          return false;
        }
        // If bed is not occupied, patient ID should be null
        if (!this.isOccupied && patientId) {
          return false;
        }
        return true;
      },
      message: 'Patient assignment must match occupation status'
    }
  },
dailyRate: {
    type: Number,
    required: [true, 'Daily rate is required'],
    min: [0, 'Daily rate cannot be negative']
  },
  facilities: [{
    type: String,
    trim: true
  }],
  lastCleaned: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: {
      values: ['available', 'occupied', 'maintenance', 'reserved'],
      message: 'Invalid bed status'
    },
    default: 'available'
  }
}, {
  timestamps: true
});

const Bed = mongoose.model("Bed", bedSchema);
export default Bed;