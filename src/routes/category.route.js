const express = require('express');
const { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} = require('../controllers/category.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// Public Route (Semua orang bisa lihat)
router.get('/', getCategories);

// Protected Routes (Hanya Admin)
router.post('/', authenticate, authorize('ADMIN'), createCategory);
router.put('/:id', authenticate, authorize('ADMIN'), updateCategory);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteCategory);

module.exports = router;