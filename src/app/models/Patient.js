import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"]
  },

  patientId: {
    type: String,
    required: [true, "Patient ID is required"],
    unique: true,
    uppercase: true,
    trim: true
  },

  personalInfo: {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minLength: [2, "First name must be at least 2 Char"],
      maxLength: [50, "First name can not exceed 50 char"]
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minLength: [2, "Last name must be at least 2 Char"],
      maxLength: [50, "Last name can not exceed 50 char"]
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Date of birth is required"],
      validate: {
        validator: function (date) {
          return date < new Date();
        },

        message: "Date of birth must be in past"
      }
    },

    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: {
        values: ["male", "female", "other"],
        message: "Gender is required"
      }
    },
  },


  bloodGroup: {
    type: String,
    enum: {
      values: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      message: "Invalid blood group"
    }
  },

  maritalStatus: {
    type: String,
    enum: {
      values: ["single", "married", "divorced", "widowed"],
      message: "Invalid marital status"
    }
  },

  occupation: {
    type: String,
    trim: true,
    maxLength: [100, "Occupation can not exceed 100 chars"]
  },

  nationality: {
    type: String,
    trim: true,
    maxLength: [50, "nationality can not exceed 100 chars"]
  },

  contactInfo: {
    phone: {
      type: String,
      required: [true, "Phone number is required"],
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
      street: {
        type: String,
        trim: true
      },
      city: {
        type: String,
        trim: true
      },
      state: {
        type: String,
        trim: true
      },
      zipCode: {
        type: String,
        trim: true
      },
      country: {
        type: String,
        trim: true,
        default: "India"
      }
    }
  },

  emergencyContact: {
    name: {
      type: String,
      // required: [true, "Emergency Contact name is required"],
      trim: true
    },
    relationship: {
      type: String,
      // required: [true, "Emergency contact relationship is required"],
      trim: true
    },
    address: {
      type: String,
      trim: true
    }
  },

  medicalInfo: {
    allergies: [{
      type: String,
      trim: true
    }],
    chronicConditions: [{
      type: String,
      trim: true
    }],
    currentMedications: [{
      type: String,
      trim: true
    }],
    insuranceInfo: {
      provider: {
        type: String,
        trim: true
      },
      policyNumber: {
        type: String,
        trim: true
      },
      groupNumber: {
        type: String,
        trim: true
      },
      validUntil: Date
    }
  },

  registrationDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Patient = mongoose.models.Patient || mongoose.model("Patient", PatientSchema);
export default Patient;