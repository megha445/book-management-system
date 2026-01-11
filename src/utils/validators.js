import { body, param, query, validationResult } from 'express-validator';

// Middleware to handle validation errors
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// User Registration Validation
export const registerValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin'),
];

// User Login Validation
export const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required'),
];

// Create Book Validation
export const createBookValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Book title is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),

  body('author')
    .trim()
    .notEmpty()
    .withMessage('Author name is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Author name must be between 1 and 100 characters'),

  body('isbn')
    .trim()
    .notEmpty()
    .withMessage('ISBN is required')
    .matches(/^(?:\d{10}|\d{13})$/)
    .withMessage('ISBN must be either 10 or 13 digits'),

  body('publicationYear')
    .notEmpty()
    .withMessage('Publication year is required')
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage(`Publication year must be between 1000 and ${new Date().getFullYear()}`),

  body('genre')
    .trim()
    .notEmpty()
    .withMessage('Genre is required')
    .isIn(['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Technology', 'Other'])
    .withMessage('Invalid genre. Must be one of: Fiction, Non-Fiction, Science, History, Biography, Technology, Other'),

  body('totalCopies')
    .notEmpty()
    .withMessage('Total copies is required')
    .isInt({ min: 1 })
    .withMessage('Total copies must be at least 1'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),

  body('coverImage')
    .optional()
    .trim()
    .isURL()
    .withMessage('Cover image must be a valid URL'),
];

// Update Book Validation
export const updateBookValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Book title cannot be empty')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),

  body('author')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Author name cannot be empty')
    .isLength({ min: 1, max: 100 })
    .withMessage('Author name must be between 1 and 100 characters'),

  body('isbn')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('ISBN cannot be empty')
    .matches(/^(?:\d{10}|\d{13})$/)
    .withMessage('ISBN must be either 10 or 13 digits'),

  body('publicationYear')
    .optional()
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage(`Publication year must be between 1000 and ${new Date().getFullYear()}`),

  body('genre')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Genre cannot be empty')
    .isIn(['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Technology', 'Other'])
    .withMessage('Invalid genre'),

  body('totalCopies')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Total copies must be at least 1'),

  body('availableCopies')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Available copies cannot be negative'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),

  body('coverImage')
    .optional()
    .trim()
    .isURL()
    .withMessage('Cover image must be a valid URL'),
];

// MongoDB ObjectId Validation
export const mongoIdValidation = [
  param('id')
    .notEmpty()
    .withMessage('ID is required')
    .isMongoId()
    .withMessage('Invalid ID format'),
];

// Borrow Book Validation
export const borrowBookValidation = [
  body('bookId')
    .notEmpty()
    .withMessage('Book ID is required')
    .isMongoId()
    .withMessage('Invalid book ID format'),
];

// Query Validation for Get Books
export const getBooksQueryValidation = [
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),

  query('genre')
    .optional()
    .trim()
    .isIn(['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Technology', 'Other'])
    .withMessage('Invalid genre'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),
];

// Query Validation for Get Borrow Records
export const getBorrowRecordsQueryValidation = [
  query('status')
    .optional()
    .trim()
    .isIn(['borrowed', 'returned', 'overdue'])
    .withMessage('Invalid status. Must be one of: borrowed, returned, overdue'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),
];