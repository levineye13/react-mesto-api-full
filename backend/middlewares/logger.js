const winston = require('winston');
const expressWinston = require('express-winston');

// Логирование всех запросов.
module.exports.requestLogger = expressWinston.logger({
  transports: [new winston.transports.File({ filename: 'request.log' })],
  format: winston.format.json(),
});

// Логирование всех ошибок.
module.exports.errorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.File({ filename: 'error.log' })],
  format: winston.format.json(),
});
