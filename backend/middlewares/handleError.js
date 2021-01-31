const { InternalServerError } = require('../errors/errors');

/**
 * Централизованный обработчик ошибок приложения.
 * Ошибка по умолчанию - 500.
 *
 * @param  {Object} err - объект ошибки
 * @param  {Object} req - объект запроса к серверу
 * @param  {Object} res - объект ответа сервера
 * @param  {Function} next - функция промежуточной обработки
 */
module.exports = (err, req, res, next) => {
  const serverError = new InternalServerError();
  const { statusCode = serverError.statusCode, message } = err;
  res.status(statusCode).send({
    message:
      statusCode === serverError.statusCode ? serverError.message : message,
  });
};
