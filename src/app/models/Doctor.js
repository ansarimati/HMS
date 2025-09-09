import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User Id is required"]
  },

  doctorId: {
    type: String,
    required: [true, "Doctor id is required"],
    unique: true,
    uppercase: true,
    trim: true
  },

  personalInfo: {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minLength: [2, "First name must be at least 2 char"]
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minLength: [2, "Last name must be at least 2 char"]
    },
    dateOfBirth: {
      type: Date,
      // required: [true, "Date of birth is required"],
      validate: {
        validator: function (date) {
          return date < new Date();
        },
        message: "Date of birth should be from past"
      }
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["male", "female", "other"]
    },
    phone: {
      type: String,
      // required: [true, "Phone number is required"],
      match: [/^\+?[\d\s-()]{10,15}$/, 'Please enter a valid phone number']
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      zipcode: { type: String, trim: true },
      country: { type: String, trim: true, default: "India" },
    }
  },

  professionalInfo: {
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
      trim: true
    },
    qualification: {
      type: [String],
      required: [true, "Qualification is required"],
      validate: {
        validator: function (qualification) {
          return qualification.length > 0;
        },
        message: "At least one qualification is required"
      }
    },
    experience: {
      type: Number,
      // required: [true, "Experience is required"],
      min: [0, "Experience can not be negative"],
      max: [100, "Experience can not exceed 100 years"]
    },
    licenseNumber: {
      type: String,
      required: [true, "License number is required"],
      unique: true,
      trim: true
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      // required: [true, "Department is required"]
    },
    consultationFees: {
      type: Number,
      min: [0, "Consultation fee can not be negative"],
    },
    availableHours: {
      monday: { start: String, end: String, isAvailable: { type: Boolean, default: true } },
      tuesday: { start: String, end: String, isAvailable: { type: Boolean, default: true } },
      wednesday: { start: String, end: String, isAvailable: { type: Boolean, default: true } },
      thursday: { start: String, end: String, isAvailable: { type: Boolean, default: true } },
      friday: { start: String, end: String, isAvailable: { type: Boolean, default: true } },
      saturday: { start: String, end: String, isAvailable: { type: Boolean, default: true } },
      sunday: { start: String, end: String, isAvailable: { type: Boolean, default: true } },
    }
  },
  joinDate: {
    type: Date,
    // required: [true, "Join date is required"],
    default: Date.now()
  },
  status: {
    type: String,
    enum: {
      values: ["active", "inactive", "on-leave"],
      message: "Status must be active, inactive or on-leave"
    },
    default: "active"
  }
},
  {
    timestamps: true
  }
);

const Doctor = mongoose.models.Doctor || mongoose.model("Doctor", DoctorSchema);
export default Doctor;