import mongoose from "mongoose";

const wardSchema = new mongoose.Schema({
  wardNumber: {
    type: String,
    required: [true, 'Ward number is required'],
    unique: true,
    trim: true
  },
  wardName: {
    type: String,
    required: [true, 'Ward name is required'],
    trim: true,
    minlength: [2, 'Ward name must be at least 2 characters']
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: [true, 'Department is required']
  },
  wardType: {
    type: String,
    required: [true, 'Ward type is required'],
    enum: {
      values: ['general', 'private', 'ICU', 'emergency', 'maternity', 'pediatric'],
      message: 'Invalid ward type'
    }
  },
  totalBeds: {
    type: Number,
    required: [true, 'Total beds is required'],
    min: [1, 'Total beds must be at least 1']
  },
  availableBeds: {
    type: Number,
    required: [true, 'Available beds is required'],
    min: [0, 'Available beds cannot be negative'],
    validate: {
      validator: function(availableBeds) {
        return availableBeds <= this.totalBeds;
      },
      message: 'Available beds cannot exceed total beds'
    }
  },
  inchargeNurse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Nurse'
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  facilities: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Ward = mongoose.model("Ward", wardSchema);
export default Ward;