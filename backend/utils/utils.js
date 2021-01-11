/**
 * Функция обработки ошибок
 * @param  {Object} responce - объект ответа сервера
 * @param  {Object} error - объект ошибки
 * @param  {Number} errorCode - код ошибки http запроса
 */
module.exports.handleError = ({ responce, error, errorCode }) => {
  console.error(error.stack);
  responce.status(errorCode).send({ message: error.message });
};
