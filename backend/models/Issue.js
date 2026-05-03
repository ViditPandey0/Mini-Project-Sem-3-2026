import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true
  },
  action: {
    type: String,
    enum: ['Checkout', 'Return'],
    required: true
  },
  notes: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Issue = mongoose.model('Issue', issueSchema);
export default Issue;
