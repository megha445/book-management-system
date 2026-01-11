import express from 'express';
import {
  borrowBook,
  returnBook,
  getMyBorrowHistory,
  getAllBorrowRecords,
  checkOverdueBooks,
} from '../controllers/borrowController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';
import {
  borrowBookValidation,
  mongoIdValidation,
  getBorrowRecordsQueryValidation,
  validate,
} from '../utils/validators.js';

const router = express.Router();

/**
 * @swagger
 * /api/borrow:
 *   post:
 *     summary: Borrow a book
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *             properties:
 *               bookId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Book borrowed successfully
 */
router.post('/', protect, borrowBookValidation, validate, borrowBook);

/**
 * @swagger
 * /api/borrow/{id}/return:
 *   put:
 *     summary: Return a borrowed book
 *     tags: [Borrow]
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
 *         description: Book returned successfully
 */
router.put('/:id/return', protect, mongoIdValidation, validate, returnBook);

/**
 * @swagger
 * /api/borrow/my-history:
 *   get:
 *     summary: Get current user's borrow history
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Borrow history retrieved
 */
router.get('/my-history', protect, getMyBorrowHistory);

/**
 * @swagger
 * /api/borrow:
 *   get:
 *     summary: Get all borrow records (Admin only)
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of all borrow records
 */
router.get('/', protect, authorize('admin'), getBorrowRecordsQueryValidation, validate, getAllBorrowRecords);

/**
 * @swagger
 * /api/borrow/check-overdue:
 *   get:
 *     summary: Check overdue books and send notifications (Admin only)
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Overdue check completed
 */
router.get('/check-overdue', protect, authorize('admin'), checkOverdueBooks);

export default router;