const express = require('express');
const { buyTicket, getMyTickets } = require('../controllers/ticket.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);

router.post('/buy', buyTicket);
router.get('/my-tickets', getMyTickets);

module.exports = router;