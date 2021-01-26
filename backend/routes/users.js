const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  logout,
  getCurrentUser,
  getAllUsers,
  getProfile,
  updateProfile,
  updateAvatar,
} = require('./../controllers/usersController.js');
const { regexpLink } = require('../utils/constants.js');

usersRouter.get('/users', getAllUsers);

usersRouter.get('/users/me', getCurrentUser);

usersRouter.get(
  '/users/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().required().alphanum(),
    }),
  }),
  getProfile
);

usersRouter.delete('/signout', logout);

usersRouter.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
      about: Joi.string().min(2).max(30).default('Исследователь'),
    }),
  }),
  updateProfile
);

usersRouter.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string()
        .pattern(regexpLink)
        .default(
          'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'
        ),
    }),
  }),
  updateAvatar
);

module.exports = { usersRouter };
