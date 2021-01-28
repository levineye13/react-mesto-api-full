const rateLimit = require('express-rate-limit');

//Мидлвар лимита запросов с одного IP за сутки.
module.exports.limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 100,
  statusCode: 429,
  message: 'Вы превысили максимальное число запросов.',
  headers: true,
});
