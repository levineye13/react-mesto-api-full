const usersRouter = require('express').Router();
const {
  getAllUsers,
  getProfile,
  updateProfile,
  updateAvatar,
} = require('./../controllers/usersController.js');

usersRouter.get('/users', getAllUsers);
usersRouter.get('/users/:userId', getProfile);
usersRouter.patch('/users/me', updateProfile);
usersRouter.patch('/users/me/avatar', updateAvatar);

module.exports = { usersRouter };
