import express from 'express';
import Book from '../models/Book.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch books', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, author, isbn, category, totalCopies, availableCopies } = req.body;
    const book = new Book({ title, author, isbn, category, totalCopies, availableCopies });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create book', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, author, isbn, category, totalCopies, availableCopies } = req.body;
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    book.title = title;
    book.author = author;
    book.isbn = isbn;
    book.category = category;
    book.totalCopies = totalCopies;
    book.availableCopies = availableCopies;

    await book.save();
    res.json(book);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update book', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete book', error: error.message });
  }
});

export default router;
