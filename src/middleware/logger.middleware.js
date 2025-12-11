const morgan = require('morgan');

const loggerMiddleware = morgan(':date[iso] :method :url :remote-addr :status - :response-time ms');

module.exports = loggerMiddleware;