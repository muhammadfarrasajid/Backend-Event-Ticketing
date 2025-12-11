const express = require('express');
const { 
  getEvents, 
  getEventById, 
  createEvent, 
  updateEvent, 
  deleteEvent 
} = require('../controllers/event.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const validate = require('../middleware/validation.middleware');
const { createEventSchema } = require('../validators/event.validator');

const router = express.Router();

// Public Routes
router.get('/', getEvents);
router.get('/:id', getEventById);

// Protected Routes (Admin Only)
router.post('/', authenticate, authorize('ADMIN'), validate(createEventSchema), createEvent);
router.put('/:id', authenticate, authorize('ADMIN'), validate(updateEventSchema), updateEvent);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteEvent);

module.exports = router;