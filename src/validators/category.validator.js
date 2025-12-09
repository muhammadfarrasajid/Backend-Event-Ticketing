const Joi = require('joi');

const createCategorySchema = Joi.object({
  name: Joi.string().required()
});

module.exports = { createCategorySchema };