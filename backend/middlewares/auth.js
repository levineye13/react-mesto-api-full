const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');

const { UnauthorizedError } = require('../errors/errors');

module.exports = (req, res, next) => {
  const { jwt: JWT } = req.cookies;

  if (!JWT || !JWT.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  const token = JWT.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'
    );
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload;
  next();
};
