import express from 'express';
import Book from '../models/Book.js';
import Member from '../models/Member.js';
import Issue from '../models/Issue.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const issues = await Issue.find()
      .sort({ createdAt: -1 })
      .populate('book', 'title author isbn')
      .populate('member', 'name membershipId email');
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch issue history', error: error.message });
  }
});

router.post('/checkout', async (req, res) => {
  try {
    const { bookId, memberId, notes } = req.body;
    const book = await Book.findById(bookId);
    const member = await Member.findById(memberId);

    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (!member) return res.status(404).json({ message: 'Member not found' });
    if (book.availableCopies <= 0) return res.status(400).json({ message: 'No copies available to checkout' });

    book.availableCopies -= 1;
    await book.save();

    const issue = new Issue({ book: book._id, member: member._id, action: 'Checkout', notes });
    await issue.save();

    res.json({ book, issue });
  } catch (error) {
    res.status(500).json({ message: 'Failed to checkout book', error: error.message });
  }
});

router.post('/return', async (req, res) => {
  try {
    const { bookId, memberId, notes } = req.body;
    const book = await Book.findById(bookId);
    const member = await Member.findById(memberId);

    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (!member) return res.status(404).json({ message: 'Member not found' });

    book.availableCopies += 1;
    if (book.availableCopies > book.totalCopies) {
      book.availableCopies = book.totalCopies;
    }
    await book.save();

    const issue = new Issue({ book: book._id, member: member._id, action: 'Return', notes });
    await issue.save();

    res.json({ book, issue });
  } catch (error) {
    res.status(500).json({ message: 'Failed to return book', error: error.message });
  }
});

export default router;
