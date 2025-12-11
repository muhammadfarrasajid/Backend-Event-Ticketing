const express = require('express');
const { buyTicket, getMyTickets, cancelTicket } = require('../controllers/ticket.controller');
const { authenticate } = require('../middleware/auth.middleware');
const validate = require('../middleware/validation.middleware');
const { buyTicketSchema } = require('../validators/ticket.validator');

const router = express.Router();

router.use(authenticate);

router.post('/buy', validate(buyTicketSchema), buyTicket);
router.get('/my-tickets', getMyTickets);
router.delete('/:id', cancelTicket);

module.exports = router;