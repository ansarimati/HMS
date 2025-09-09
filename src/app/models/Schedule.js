import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Staff is required'],
    refPath: 'staffType'
  },
  staffType: {
    type: String,
    required: [true, 'Staff type is required'],
    enum: {
      values: ['Doctor', 'Nurse'],
      message: 'Staff type must be Doctor or Nurse'
    }
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    validate: {
      validator: function(date) {
        return date >= new Date().setHours(0, 0, 0, 0);
      },
      message: 'Schedule date cannot be in the past'
    }
  },
  shift: {
    type: String,
    required: [true, 'Shift is required'],
    enum: {
      values: ['morning', 'evening', 'night'],
      message: 'Invalid shift'
    }
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required'],
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)']
  },
  endTime: {
    type: String,
    required: [true, 'End time is required'],
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)']
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: [true, 'Department is required']
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [200, 'Notes cannot exceed 200 characters']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Created by is required']
  }
}, {
  timestamps: true
});

const Schedule = mongoose.model("Schedule", scheduleSchema);

export default Schedule;