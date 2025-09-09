import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Department name is required'],
    unique: true,
    trim: true,
    minlength: [2, 'Department name must be at least 2 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  headOfDepartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
    match: [/^\+?[\d\s-()]{10,15}$/, 'Please enter a valid contact number']
  },
  totalBeds: {
    type: Number,
    required: [true, 'Total beds is required'],
    min: [0, 'Total beds cannot be negative']
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

const Department = mongoose.models.Department || mongoose.model("Department", DepartmentSchema);

export default Department;