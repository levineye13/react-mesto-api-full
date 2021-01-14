const cardsRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { regexpLink } = require('../utils/constants.js');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('./../controllers/cardsController.js');

cardsRouter.get('/cards', getCards);

cardsRouter.post(
  '/cards',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().pattern(regexpLink),
    }),
  }),
  createCard
);

cardsRouter.delete(
  '/cards/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().alphanum().length(24),
    }),
  }),
  deleteCard
);

cardsRouter.put(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().alphanum().length(24),
    }),
  }),
  likeCard
);

cardsRouter.delete(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().alphanum().length(24),
    }),
  }),
  dislikeCard
);

module.exports = { cardsRouter };
