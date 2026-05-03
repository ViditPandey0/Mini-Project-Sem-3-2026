import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  isbn: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  category: {
    type: String,
    trim: true,
    default: 'General'
  },
  totalCopies: {
    type: Number,
    required: true,
    min: 0,
    default: 1
  },
  availableCopies: {
    type: Number,
    required: true,
    min: 0,
    default: 1
  },
  status: {
    type: String,
    enum: ['Available', 'Low Stock', 'Out of Stock'],
    default: 'Available'
  }
}, {
  timestamps: true
});

bookSchema.pre('save', function (next) {
  if (this.availableCopies <= 0) {
    this.status = 'Out of Stock';
  } else if (this.availableCopies < 3) {
    this.status = 'Low Stock';
  } else {
    this.status = 'Available';
  }
  next();
});

const Book = mongoose.model('Book', bookSchema);
export default Book;
