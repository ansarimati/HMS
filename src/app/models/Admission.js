import mongoose from "mongoose";

const admissionSchema = new mongoose.Schema({
  admissionId: {
    type: String,
    required: [true, 'Admission ID is required'],
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
  bed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bed',
    required: [true, 'Bed is required']
  },
  admissionDate: {
    type: Date,
    required: [true, 'Admission date is required'],
    default: Date.now
  },
  dischargeDate: {
    type: Date,
    validate: {
      validator: function(date) {
        return !date || date > this.admissionDate;
      },
      message: 'Discharge date must be after admission date'
    }
  },
  admissionType: {
    type: String,
    required: [true, 'Admission type is required'],
    enum: {
      values: ['emergency', 'planned', 'transfer'],
      message: 'Invalid admission type'
    }
  },
  reasonForAdmission: {
    type: String,
    required: [true, 'Reason for admission is required'],
    trim: true,
    minlength: [10, 'Reason must be at least 10 characters']
  },
  condition: {
    type: String,
    required: [true, 'Patient condition is required'],
    enum: {
      values: ['stable', 'critical', 'serious', 'fair', 'good'],
      message: 'Invalid patient condition'
    }
  },
  status: {
    type: String,
    enum: {
      values: ['admitted', 'discharged', 'transferred', 'expired'],
      message: 'Invalid admission status'
    },
    default: 'admitted'
  },
  attendingNurses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Nurse'
  }],
  dailyCharges: {
    type: Number,
    required: [true, 'Daily charges is required'],
    min: [0, 'Daily charges cannot be negative']
  },
  totalCharges: {
    type: Number,
    min: [0, 'Total charges cannot be negative']
  },
  dischargeNotes: {
    type: String,
    trim: true
  },
  dischargeMedications: [{
    type: String,
    trim: true
  }],
  followUpInstructions: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const Admission = mongoose.models.Admission || mongoose.model("Admission", admissionSchema);

export default Admission;