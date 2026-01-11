import express from 'express';
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from '../controllers/bookController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';
import {
  createBookValidation,
  updateBookValidation,
  mongoIdValidation,
  getBooksQueryValidation,
  validate,
} from '../utils/validators.js';

const router = express.Router();

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get all books with search and filter
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by title, author, or ISBN
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filter by genre
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of books
 */
router.get('/', getBooksQueryValidation, validate, getAllBooks);

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Get book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book details
 */
router.get('/:id', mongoIdValidation, validate, getBookById);

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Create a new book (Admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - isbn
 *               - publicationYear
 *               - genre
 *               - totalCopies
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               isbn:
 *                 type: string
 *               publicationYear:
 *                 type: number
 *               genre:
 *                 type: string
 *               totalCopies:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Book created successfully
 */
router.post('/', protect, authorize('admin'), createBookValidation, validate, createBook);

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Update book (Admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book updated successfully
 */
router.put('/:id', protect, authorize('admin'), mongoIdValidation, updateBookValidation, validate, updateBook);

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Delete book (Admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted successfully
 */
router.delete('/:id', protect, authorize('admin'), mongoIdValidation, validate, deleteBook);

export default router;