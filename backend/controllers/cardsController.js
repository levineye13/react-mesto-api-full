const Card = require('../models/card');
const { NotFoundError, BadRequestError } = require('../errors/errors');

/**
 * Функция возвращает все карточки.
 *
 * @param  {Object} req - объект запроса к серверу
 * @param  {Object} res - объект ответа сервера
 * @param  {Function} next - функция промежуточной обработки
 */
const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    if (cards.length === 0) {
      throw new NotFoundError('Пока что карточек нет');
    }
    res.status(200).send(cards);
  } catch (err) {
    next(err);
  }
};

/**
 * Функция добавления карточки.
 *
 * @param  {Object} req - объект запроса к серверу
 * @param  {Object} res - объект ответа сервера
 * @param  {Function} next - функция промежуточной обработки
 */
const createCard = async (req, res, next) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  try {
    const newCard = await Card.create({ name, link, owner: { _id } });
    res.status(200).send(newCard);
  } catch (err) {
    next(
      err.name === 'ValidationError'
        ? new BadRequestError('Переданы некорректные данные')
        : err,
    );
  }
};

/**
 * Функция удаления карточки.
 *
 * @param  {Object} req - объект запроса к серверу
 * @param  {Object} res - объект ответа сервера
 * @param  {Function} next - функция промежуточной обработки
 */
const deleteCard = async (req, res, next) => {
  const { cardId } = req.params;

  try {
    const deletedCard = await Card.findByIdAndRemove(cardId);
    if (!deletedCard) {
      throw new NotFoundError('Карточка не найдена');
    }
    res.status(200).send(deletedCard);
  } catch (err) {
    next(err);
  }
};

/**
 * Функция лайка карточки.
 *
 * @param  {Object} req - объект запроса к серверу
 * @param  {Object} res - объект ответа сервера
 * @param  {Function} next - функция промежуточной обработки
 */
const likeCard = async (req, res, next) => {
  const { _id } = req.user;
  const { cardId } = req.params;

  try {
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: _id } },
      { new: true },
    );
    if (!updatedCard) {
      throw new NotFoundError('Карточка не найдена');
    }
    res.status(200).send(updatedCard);
  } catch (err) {
    next(err);
  }
};

/**
 * Функция дизлайка карточки.
 *
 * @param  {Object} req - объект запроса к серверу
 * @param  {Object} res - объект ответа сервера
 * @param  {Function} next - функция промежуточной обработки
 */
const dislikeCard = async (req, res, next) => {
  const { _id } = req.user;
  const { cardId } = req.params;

  try {
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: _id } },
      { new: true },
    );
    if (!updatedCard) {
      throw new NotFoundError('Карточка не найдена');
    }
    res.status(200).send(updatedCard);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
