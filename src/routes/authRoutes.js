import express from 'express';
import { 
  register, 
  login, 
  getMe,
  getAllUsers,
  getUserById,
  deactivateUser,
  activateUser
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import {
  registerValidation,
  loginValidation,
  mongoIdValidation,
  validate,
} from '../utils/validators.js';

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 */
router.post('/register', authLimiter, registerValidation, validate, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 */
router.post('/login', authLimiter, loginValidation, validate, login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Authentication]
 */
router.get('/me', protect, getMe);

// ✅ NEW USER MANAGEMENT ROUTES (ADMIN ONLY)

/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [User Management]
 */
router.get('/users', protect, authorize('admin'), getAllUsers);

/**
 * @swagger
 * /api/auth/users/{id}:
 *   get:
 *     summary: Get user by ID (Admin only)
 *     tags: [User Management]
 */
router.get('/users/:id', protect, authorize('admin'), mongoIdValidation, validate, getUserById);

/**
 * @swagger
 * /api/auth/users/{id}/deactivate:
 *   put:
 *     summary: Deactivate user account (Admin only)
 *     tags: [User Management]
 */
router.put('/users/:id/deactivate', protect, authorize('admin'), mongoIdValidation, validate, deactivateUser);

/**
 * @swagger
 * /api/auth/users/{id}/activate:
 *   put:
 *     summary: Activate user account (Admin only)
 *     tags: [User Management]
 */
router.put('/users/:id/activate', protect, authorize('admin'), mongoIdValidation, validate, activateUser);

export default router;