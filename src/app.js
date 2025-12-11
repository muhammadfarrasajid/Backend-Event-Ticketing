const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth.route');
const categoryRoutes = require('./routes/category.route');
const eventRoutes = require('./routes/event.route');
const ticketRoutes = require('./routes/ticket.route');
const { sendResponse } = require('./utils/response.util');

const app = express();

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/tickets', ticketRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);

  const statusCode = 500;
  const message = 'Internal Server Error';
  const errorDetail = process.env.NODE_ENV === 'development' ? err.message : undefined;

  res.status(statusCode).json({
    success: false,
    message: message,
    error: errorDetail
  });
});

module.exports = app;