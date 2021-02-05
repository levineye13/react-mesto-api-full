const router = require('express').Router();

const { createUser, login } = require('../controllers/usersController');
const auth = require('../middlewares/auth');
const {
  validateAuthentication,
  validateUserBody,
} = require('../middlewares/routeValidators');
const { usersRouter } = require('./users');
const { cardsRouter } = require('./cards');

router.post('/signup', validateUserBody, createUser);
router.post('/signin', validateAuthentication, login);

router.use(auth);

router.use(usersRouter);
router.use(cardsRouter);

module.exports = router;
