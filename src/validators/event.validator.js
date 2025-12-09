const Joi = require('joi');

const createEventSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  date: Joi.date().iso().required(),
  location: Joi.string().required(),
  price: Joi.number().min(0).required(),
  stock: Joi.number().integer().min(0).required(),
  categoryId: Joi.number().integer().required()
});

const updateEventSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  date: Joi.date().iso(),
  location: Joi.string(),
  price: Joi.number().min(0),
  stock: Joi.number().integer().min(0),
  categoryId: Joi.number().integer()
});

module.exports = { createEventSchema, updateEventSchema };