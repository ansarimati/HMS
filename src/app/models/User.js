import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },

  password: {
    type: String,
    required: [true,"Password is required"],
    minLength: [8, "Password must be at least 8 characters long"],
    select: false
  },

  role: {
    type: String,
    required: [true, "Role is required"],
    enum: {
      values: ["admin", "doctor", "nurse", "receptionist", "patient", "pharmacist"],
      message: "Role is required"
    }
  },

  isActive: {
    type: Boolean,
    default: true
  },

  lastLogin: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,

  emailVerified: {
    type: Boolean,
    default: false
  },

  emailVerificationToken: String
}, {
  timestamps: true
});


// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); 

  try {
    // Hash password with cost of 12
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    next();
  } catch (error) {
    console.log("Error in User pre hook", error);
    next(error);
  }
});

// Instance method to check password
UserSchema.methods.comparePassword = async function (candidatesPassword) {
  return await bcrypt.compare(candidatesPassword, this.password);
};

// Instance method to generate reset token
UserSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

    // Token expires in 10 minutes
    this.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
}

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;