const { sendResponse } = require('../utils/response.util');

const validate = (schema) => (req, res, next) => {
  if (schema) {
    const { error } = schema.validate(req.body);
    if (error) {
      return sendResponse(res, 400, error.details[0].message);
    }
  }
  next();
};

module.exports = validate;