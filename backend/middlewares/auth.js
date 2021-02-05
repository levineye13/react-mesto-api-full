const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../config');
const { UnauthorizedError } = require('../errors');

/**
 * Мидлвар проверки авторизованности пользователя.
 * Если куки переданы и они корректны, то извлекает id и записывает в запрос
 * для использования остальными обработчиками.
 *
 * @param  {Object} req - объект запроса к серверу
 * @param  {Object} res - объект ответа сервера
 * @param  {Function} next - функция промежуточной обработки
 */
module.exports = (req, res, next) => {
  const { jwt: JWT } = req.cookies;

  if (!JWT || !JWT.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  const token = JWT.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload;
  return next();
};
