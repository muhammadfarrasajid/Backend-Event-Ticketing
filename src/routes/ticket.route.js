const express = require('express');
const { buyTicket, getMyTickets, cancelTicket } = require('../controllers/ticket.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);

router.post('/buy', buyTicket);
router.get('/my-tickets', getMyTickets);
router.delete('/:id', cancelTicket);

module.exports = router;