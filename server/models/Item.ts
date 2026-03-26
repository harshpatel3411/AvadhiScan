import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  brand: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['groceries', 'medicines', 'cosmetics', 'household', 'other'],
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  price: {
  type: Number,
  required: true,
  default: 0
},
  notes: {
    type: String,
    trim: true,
  },
  barcode: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

export const Item = mongoose.model('Item', itemSchema);