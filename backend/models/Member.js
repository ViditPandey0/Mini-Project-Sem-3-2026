import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  membershipId: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  phone: {
    type: String,
    trim: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Member = mongoose.model('Member', memberSchema);
export default Member;
