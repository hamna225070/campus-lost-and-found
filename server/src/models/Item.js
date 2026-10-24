const mongoose = require('mongoose');

const CATEGORIES = [
  'ID Cards',
  'Books and Stationery',
  'Electronics',
  'Bags',
  'Keys',
  'Wallets',
  'Clothing',
  'Other',
];

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an item name'],
      trim: true,
      minlength: [2, 'Item name must be at least 2 characters long'],
      maxlength: [100, 'Item name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description of the item'],
      trim: true,
      minlength: [5, 'Description must be at least 5 characters long'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: {
        values: CATEGORIES,
        message: '{VALUE} is not a valid category',
      },
    },
    type: {
      type: String,
      required: [true, 'Please specify if item is lost or found'],
      enum: {
        values: ['lost', 'found'],
        message: 'Type must be either lost or found',
      },
    },
    location: {
      type: String,
      required: [true, 'Please specify the campus location'],
      trim: true,
      minlength: [2, 'Location must be at least 2 characters long'],
      maxlength: [120, 'Location cannot exceed 120 characters'],
    },
    dateOfIncident: {
      type: Date,
      required: [true, 'Please provide the date when the item was lost or found'],
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    contactInfo: {
      type: String,
      required: [true, 'Please provide contact information (e.g. phone or email)'],
      trim: true,
      minlength: [3, 'Contact information must be at least 3 characters long'],
      maxlength: [200, 'Contact information cannot exceed 200 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['open', 'resolved'],
        message: 'Status must be either open or resolved',
      },
      default: 'open',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Item must belong to a registered user'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast searching and filtering
itemSchema.index({ type: 1, status: 1 });
itemSchema.index({ category: 1 });
itemSchema.index({ user: 1 });
itemSchema.index({ createdAt: -1 });
itemSchema.index({ title: 'text', description: 'text', location: 'text' });

module.exports = {
  Item: mongoose.model('Item', itemSchema),
  CATEGORIES,
};
