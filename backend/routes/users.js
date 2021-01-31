const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  logout,
  checkAuth,
  getCurrentUser,
  getAllUsers,
  getProfile,
  updateProfile,
  updateAvatar,
} = require('../controllers/usersController.js');
const { regexpLink } = require('../utils/constants.js');

usersRouter.head('/signout', logout);

usersRouter.head('users/me', checkAuth);

usersRouter.get('/users', getAllUsers);

usersRouter.get('/users/me', getCurrentUser);

usersRouter.get(
  '/users/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().required().alphanum().length(24),
    }),
  }),
  getProfile
);

usersRouter.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateProfile
);

usersRouter.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().pattern(regexpLink),
    }),
  }),
  updateAvatar
);

module.exports = { usersRouter };
