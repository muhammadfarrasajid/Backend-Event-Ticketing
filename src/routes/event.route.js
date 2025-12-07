const express = require('express');
const { 
  getEvents, 
  getEventById, 
  createEvent, 
  updateEvent, 
  deleteEvent 
} = require('../controllers/event.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// Public Routes
router.get('/', getEvents);
router.get('/:id', getEventById);

// Protected Routes (Admin Only)
router.post('/', authenticate, authorize('ADMIN'), createEvent);
router.put('/:id', authenticate, authorize('ADMIN'), updateEvent);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteEvent);

module.exports = router;