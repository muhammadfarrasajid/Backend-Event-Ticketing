const Joi = require('joi');

const buyTicketSchema = Joi.object({
  eventId: Joi.number().integer().required().messages({
    'number.base': 'Event ID must be a number',
    'any.required': 'Event ID is required'
  })
});

module.exports = { buyTicketSchema };