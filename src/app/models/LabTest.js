import mongoose from "mongoose";

const labTestSchema = new mongoose.Schema({
  testId: {
    type: String,
    required: [true, 'Test ID is required'],
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
  testName: {
    type: String,
    required: [true, 'Test name is required'],
    trim: true
  },
  testCategory: {
    type: String,
    required: [true, 'Test category is required'],
    enum: {
      values: ['blood', 'urine', 'imaging', 'pathology', 'microbiology', 'cardiology'],
      message: 'Invalid test category'
    }
  },
  orderedDate: {
    type: Date,
    required: [true, 'Ordered date is required'],
    default: Date.now
  },
  sampleCollectedDate: Date,
  reportDate: Date,
  status: {
    type: String,
    enum: {
      values: ['ordered', 'sample-collected', 'in-progress', 'completed', 'cancelled'],
      message: 'Invalid test status'
    },
    default: 'ordered'
  },
  results: {
    normalValues: String,
    actualValues: String,
    units: String,
    interpretation: String,
    isAbnormal: {
      type: Boolean,
      default: false
    }
  },
  technician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reportUrl: {
    type: String,
    match: [/^https?:\/\/.+/, 'Invalid report URL']
  },
  cost: {
    type: Number,
    required: [true, 'Cost is required'],
    min: [0, 'Cost cannot be negative']
  },
  paymentStatus: {
    type: String,
    enum: {
      values: ['pending', 'paid', 'insurance-covered'],
      message: 'Invalid payment status'
    },
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
},
  {
    timestamps: true
  }
);

const LabTest = mongoose.model("LabTest", labTestSchema);

export default LabTest;