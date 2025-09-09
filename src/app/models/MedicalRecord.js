import mongoose from "mongoose";

const medicalRecordsSchema = new mongoose.Schema({
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
  visitDate: {
    type: Date,
    required: [true, 'Visit date is required'],
    default: Date.now
  },
  chiefComplaint: {
    type: String,
    required: [true, 'Chief complaint is required'],
    trim: true,
    minlength: [10, 'Chief complaint must be at least 10 characters']
  },
  presentIllnessHistory: {
    type: String,
    trim: true
  },
  pastMedicalHistory: {
    type: String,
    trim: true
  },
  familyHistory: {
    type: String,
    trim: true
  },
  socialHistory: {
    type: String,
    trim: true
  },
  physicalExamination: {
    vitalSigns: {
      temperature: {
        type: Number,
        min: [35, 'Temperature too low'],
        max: [45, 'Temperature too high']
      },
      bloodPressure: {
        type: String,
        match: [/^\d{2,3}\/\d{2,3}$/, 'Please enter valid blood pressure format (e.g., 120/80)']
      },
      heartRate: {
        type: Number,
        min: [40, 'Heart rate too low'],
        max: [200, 'Heart rate too high']
      },
      respiratoryRate: {
        type: Number,
        min: [8, 'Respiratory rate too low'],
        max: [40, 'Respiratory rate too high']
      },
      oxygenSaturation: {
        type: Number,
        min: [70, 'Oxygen saturation too low'],
        max: [100, 'Oxygen saturation cannot exceed 100%']
      },
      weight: {
        type: Number,
        min: [0.5, 'Weight too low'],
        max: [300, 'Weight too high']
      },
      height: {
        type: Number,
        min: [30, 'Height too low'],
        max: [250, 'Height too high']
      },
      bmi: {
        type: Number,
        min: [10, 'BMI too low'],
        max: [50, 'BMI too high']
      }
    },
    generalExamination: String,
    systemicExamination: String
  },
diagnosis: {
    primary: {
      type: String,
      required: [true, 'Primary diagnosis is required'],
      trim: true
    },
    secondary: [{
      type: String,
      trim: true
    }],
    icd10Codes: [{
      type: String,
      match: [/^[A-Z]\d{2}(\.\d{1,2})?$/, 'Invalid ICD-10 code format']
    }]
  },
  treatment: {
    medications: [{
      name: {
        type: String,
        required: [true, 'Medication name is required'],
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
      },
      instructions: {
        type: String,
        trim: true
      }
    }],
    procedures: [{
      type: String,
      trim: true
    }],
    recommendations: {
      type: String,
      trim: true
    }
  },
  followUpDate: Date,
  followUpInstructions: {
    type: String,
    trim: true
  },
attachments: [{
    fileName: {
      type: String,
      required: [true, 'File name is required']
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
      match: [/^https?:\/\/.+/, 'Invalid file URL']
    },
    fileType: {
      type: String,
      required: [true, 'File type is required'],
      enum: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx']
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

const MedicalRecord = mongoose.model("MedicalRecords", medicalRecordsSchema);

export default MedicalRecord;