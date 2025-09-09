import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
  itemId: {
    type: String,
    required: [true, 'Item ID is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  itemName: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    minlength: [2, 'Item name must be at least 2 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['medicine', 'equipment', 'supplies', 'consumables'],
      message: 'Invalid category'
    }
  },
   manufacturer: {
    type: String,
    required: [true, 'Manufacturer is required'],
    trim: true
  },
  batchNumber: {
    type: String,
    trim: true
  },
  expiryDate: {
    type: Date,
    validate: {
      validator: function(date) {
        return !date || date > new Date();
      },
      message: 'Expiry date must be in the future'
    }
  },
  currentStock: {
    type: Number,
    required: [true, 'Current stock is required'],
    min: [0, 'Current stock cannot be negative']
  },
  minimumStock: {
    type: Number,
    required: [true, 'Minimum stock is required'],
    min: [0, 'Minimum stock cannot be negative']
  },
  maximumStock: {
    type: Number,
    required: [true, 'Maximum stock is required'],
    min: [0, 'Maximum stock cannot be negative'],
    validate: {
      validator: function(maxStock) {
        return maxStock >= this.minimumStock;
      },
      message: 'Maximum stock must be greater than or equal to minimum stock'
    }
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    enum: {
      values: ['pieces', 'boxes', 'bottles', 'strips', 'vials', 'tablets', 'ml', 'mg'],
      message: 'Invalid unit'
    }
  },
  unitPrice: {
    type: Number,
    required: [true, 'Unit price is required'],
    min: [0, 'Unit price cannot be negative']
  },
  supplier: {
    name: {
      type: String,
      required: [true, 'Supplier name is required'],
      trim: true
    },
    contact: {
      type: String,
      required: [true, 'Supplier contact is required'],
      match: [/^\+?[\d\s-()]{10,15}$/, 'Please enter a valid contact number']
    },
    address: {
      type: String,
      required: [true, 'Supplier address is required'],
      trim: true
    }
  },
  location: {
    type: String,
    required: [true, 'Storage location is required'],
    trim: true
  },
  status: {
    type: String,
    enum: {
      values: ['available', 'out-of-stock', 'expired', 'recalled'],
      message: 'Invalid status'
    },
    default: 'available'
  },
  lastRestockedDate: Date,
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Last updated by is required']
  }
}, {
  timestamps: true
});

const Inventory = mongoose.model("Inventory", inventorySchema);

export default Inventory;