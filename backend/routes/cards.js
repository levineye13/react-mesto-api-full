const cardsRouter = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cardsController.js');
const {
  validateObjectId,
  validateCardBody,
} = require('../middlewares/routeValidators');

cardsRouter.get('/cards', getCards);

cardsRouter.post('/cards', validateCardBody, createCard);

cardsRouter.delete('/cards/:id', validateObjectId, deleteCard);

cardsRouter.put('/cards/:id/likes', validateObjectId, likeCard);

cardsRouter.delete('/cards/:id/likes', validateObjectId, dislikeCard);

module.exports = { cardsRouter };
