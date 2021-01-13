const { InternalServerError } = require('./../errors/errors');

module.exports = (err, req, res, next) => {
  const serverError = new InternalServerError();
  const { statusCode = serverError.statusCode, message } = err;

  res.status(statusCode).send({
    message:
      statusCode === serverError.statusCode ? serverError.message : message,
  });
};
