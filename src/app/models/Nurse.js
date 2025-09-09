import mongoose from "mongoose";

const nurseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  nurseId: {
    type: String,
    required: [true, 'Nurse ID is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  personalInfo: {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters']
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
      validate: {
        validator: function(date) {
          return date < new Date();
        },
        message: 'Date of birth must be in the past'
      }
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: ['male', 'female', 'other']
    },
    phone: {
      type: String,
      // required: [true, 'Phone number is required'],
      match: [/^\+?[\d\s-()]{10,15}$/, 'Please enter a valid phone number']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    }
  },
  professionalInfo: {
    qualification: {
      type: [String],
      required: [true, 'At least one qualification is required'],
      validate: {
        validator: function(qualifications) {
          return qualifications.length > 0;
        },
        message: 'At least one qualification is required'
      }
    },
    experience: {
      type: Number,
      // required: [true, 'Experience is required'],
      min: [0, 'Experience cannot be negative'],
      max: [40, 'Experience cannot exceed 40 years']
    },
    licenseNumber: {
      type: String,
      required: [true, 'License number is required'],
      unique: true,
      trim: true
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Department is required']
    },
    shift: {
      type: String,
      // required: [true, 'Shift is required'],
      enum: {
        values: ['morning', 'evening', 'night'],
        message: 'Shift must be morning, evening, or night'
      }
    },
     wardAssigned: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ward'
    }
  },
  joinDate: {
    type: Date,
    // required: [true, 'Join date is required'],
    default: Date.now
  },
  status: {
    type: String,
    enum: {
      values: ['active', 'inactive', 'on-leave'],
      message: 'Status must be active, inactive, or on-leave'
    },
    default: 'active'
  }
}, {
  timestamps: true
});

const Nurse = mongoose.models.Nurse || mongoose.model("Nurse", nurseSchema);

export default Nurse;