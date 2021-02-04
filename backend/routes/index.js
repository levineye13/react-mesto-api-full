const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { createUser, login } = require('../controllers/usersController');
const auth = require('../middlewares/auth');
const { usersRouter } = require('./users');
const { cardsRouter } = require('./cards');
const { regexpLink } = require('../utils/constants');

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(regexpLink),
    }),
  }),
  createUser,
);

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);

router.use(auth);
router.use(usersRouter);
router.use(cardsRouter);

module.exports = router;
