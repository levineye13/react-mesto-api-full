const rateLimit = require('express-rate-limit');

module.exports.limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 100,
  statusCode: 429,
  message: 'Вы превысили максимальное число запросов за сутки.',
  headers: true,
});
