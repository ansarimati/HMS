import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
  prescriptionId: {
    type: String,
    required: [true, 'Prescription ID is required'],
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
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  prescriptionDate: {
    type: Date,
    required: [true, 'Prescription date is required'],
    default: Date.now
  },
  medications: [{
    name: {
      type: String,
      required: [true, 'Medication name is required'],
      trim: true
    },
    genericName: {
      type: String,
      trim: true
    },
    strength: {
      type: String,
      required: [true, 'Medication strength is required'],
      trim: true
    },
    dosage: {
      type: String,
      required: [true, 'Dosage is required'],
      trim: true
    },
    frequency: {
      type: String,
      required: [true, 'Frequency is required'],
      trim: true
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      trim: true
    },quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1']
    },
    instructions: {
      type: String,
      trim: true
    },
    cost: {
      type: Number,
      required: [true, 'Medication cost is required'],
      min: [0, 'Cost cannot be negative']
    }
  }],
totalCost: {
    type: Number,
    required: [true, 'Total cost is required'],
    min: [0, 'Total cost cannot be negative']
  },
  pharmacyInstructions: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: {
      values: ['active', 'completed', 'cancelled', 'expired'],
      message: 'Invalid prescription status'
    },
    default: 'active'
  },
  validUntil: {
    type: Date,
    required: [true, 'Valid until date is required'],
    validate: {
      validator: function(date) {
        return date > this.prescriptionDate;
      },
      message: 'Valid until date must be after prescription date'
    }
  },
  isDispensed: {
    type: Boolean,
    default: false
  },
  dispensedDate: Date,
  dispensedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Prescription = mongoose.model("Prescription", prescriptionSchema);

export default prescriptionSchema;