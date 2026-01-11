import BorrowRecord from '../models/BorrowRecord.js';
import Book from '../models/Book.js';
import { sendOverdueEmail } from '../utils/emailService.js';

// @desc    Borrow a book
// @route   POST /api/borrow
// @access  Private
export const borrowBook = async (req, res, next) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id;

    // Check if book exists and is available
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Book is currently not available',
      });
    }

    // Check if user already borrowed this book and hasn't returned
    const existingBorrow = await BorrowRecord.findOne({
      user: userId,
      book: bookId,
      status: 'borrowed',
    });

    if (existingBorrow) {
      return res.status(400).json({
        success: false,
        message: 'You have already borrowed this book',
      });
    }

    // Create borrow record
    const borrowRecord = await BorrowRecord.create({
      user: userId,
      book: bookId,
    });

    // Decrease available copies
    book.availableCopies -= 1;
    await book.save();

    const populatedRecord = await BorrowRecord.findById(borrowRecord._id)
      .populate('user', 'username email')
      .populate('book', 'title author isbn');

    res.status(201).json({
      success: true,
      message: 'Book borrowed successfully',
      data: populatedRecord,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Return a book
// @route   PUT /api/borrow/:id/return
// @access  Private
export const returnBook = async (req, res, next) => {
  try {
    const borrowRecord = await BorrowRecord.findById(req.params.id);

    if (!borrowRecord) {
      return res.status(404).json({
        success: false,
        message: 'Borrow record not found',
      });
    }

    // Check if the user owns this borrow record
    if (borrowRecord.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to return this book',
      });
    }

    if (borrowRecord.status === 'returned') {
      return res.status(400).json({
        success: false,
        message: 'Book already returned',
      });
    }

    // Calculate fine if overdue
    const currentDate = new Date();
    const dueDate = new Date(borrowRecord.dueDate);
    
    if (currentDate > dueDate) {
      const daysOverdue = Math.ceil((currentDate - dueDate) / (1000 * 60 * 60 * 24));
      borrowRecord.fine = daysOverdue * 5; // $5 per day
    }

    borrowRecord.returnDate = currentDate;
    borrowRecord.status = 'returned';
    await borrowRecord.save();

    // Increase available copies
    const book = await Book.findById(borrowRecord.book);
    book.availableCopies += 1;
    await book.save();

    const populatedRecord = await BorrowRecord.findById(borrowRecord._id)
      .populate('user', 'username email')
      .populate('book', 'title author isbn');

    res.status(200).json({
      success: true,
      message: 'Book returned successfully',
      data: populatedRecord,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's borrow history
// @route   GET /api/borrow/my-history
// @access  Private
export const getMyBorrowHistory = async (req, res, next) => {
  try {
    const records = await BorrowRecord.find({ user: req.user.id })
      .populate('book', 'title author isbn')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all borrow records (Admin only)
// @route   GET /api/borrow
// @access  Private/Admin
export const getAllBorrowRecords = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const records = await BorrowRecord.find(query)
      .populate('user', 'username email')
      .populate('book', 'title author isbn')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await BorrowRecord.countDocuments(query);

    res.status(200).json({
      success: true,
      count: records.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: records,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check and send overdue notifications
// @route   GET /api/borrow/check-overdue
// @access  Private/Admin
export const checkOverdueBooks = async (req, res, next) => {
  try {
    const currentDate = new Date();
    
    const overdueRecords = await BorrowRecord.find({
      status: 'borrowed',
      dueDate: { $lt: currentDate },
    })
      .populate('user', 'username email')
      .populate('book', 'title author');

    // Update status to overdue
    for (const record of overdueRecords) {
      record.status = 'overdue';
      await record.save();

      // Send email notification
      await sendOverdueEmail(record.user.email, {
        username: record.user.username,
        bookTitle: record.book.title,
        dueDate: record.dueDate,
      });
    }

    res.status(200).json({
      success: true,
      message: `Found ${overdueRecords.length} overdue books. Notifications sent.`,
      data: overdueRecords,
    });
  } catch (error) {
    next(error);
  }
};