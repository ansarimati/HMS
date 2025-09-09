import mongoose from "mongoose";

const billingSchema  = new mongoose.Schema({
  billId: {
    type: String,
    required: [true, 'Bill ID is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient is required']
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  billDate: {
    type: Date,
    required: [true, 'Bill date is required'],
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
    validate: {
      validator: function(dueDate) {
        return dueDate >= this.billDate;
      },
      message: 'Due date must be after bill date'
    }
  },
  services: [{
    description: {
      type: String,
      required: [true, 'Service description is required'],
      trim: true
    },
    serviceType: {
      type: String,
      required: [true, 'Service type is required'],
      enum: {
        values: ['consultation', 'lab-test', 'medication', 'room-charges', 'procedure', 'surgery'],
        message: 'Invalid service type'
      }
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1']
    },
    unitPrice: {
      type: Number,
      required: [true, 'Unit price is required'],
      min: [0, 'Unit price cannot be negative']
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [0, 'Total price cannot be negative']
    },
    serviceDate: {
      type: Date,
      required: [true, 'Service date is required']
    }
  }],
  subtotal: {
    type: Number,
    required: [true, 'Subtotal is required'],
    min: [0, 'Subtotal cannot be negative']
  },
  tax: {
    type: Number,
    default: 0,
    min: [0, 'Tax cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative']
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  amountPaid: {
    type: Number,
    default: 0,
    min: [0, 'Amount paid cannot be negative']
  },
  balance: {
    type: Number,
    required: [true, 'Balance is required'],
    min: [0, 'Balance cannot be negative']
  },
  paymentStatus: {
    type: String,
    enum: {
      values: ['pending', 'partial', 'paid', 'overdue', 'cancelled'],
      message: 'Invalid payment status'
    },
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: {
      values: ['cash', 'card', 'insurance', 'bank-transfer', 'upi'],
      message: 'Invalid payment method'
    }
  },
insuranceClaim: {
    claimNumber: String,
    claimAmount: {
      type: Number,
      min: [0, 'Claim amount cannot be negative']
    },
    approvedAmount: {
      type: Number,
      min: [0, 'Approved amount cannot be negative']
    },
    status: {
      type: String,
      enum: {
        values: ['submitted', 'approved', 'rejected', 'processing'],
        message: 'Invalid insurance claim status'
      }
    }
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Created by is required']
  }
}, {
  timestamps: true
});

billingSchema.pre("save", function (next) {
  // calculate balance
  this.balance = this.totalAmount - this.amountPaid;

  // update payment status
  if (this.balance === 0) {
    this.paymentStatus = "paid";
  } else if (this.balance > 0) {
    this.paymentStatus = "partial";
  } else if (new Date() > this.dueDate) {
    this.paymentStatus = "overdue";
  }

  next();
})

const Billing = mongoose.model("Billing", billingSchema);

export default Billing;