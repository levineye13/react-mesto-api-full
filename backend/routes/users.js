const usersRouter = require('express').Router();
const {
  getCurrentUser,
  getAllUsers,
  getProfile,
  updateProfile,
  updateAvatar,
} = require('./../controllers/usersController.js');

usersRouter.get('/users', getAllUsers);
usersRouter.get('/users/:userId', getProfile);
usersRouter.get('/users/me', getCurrentUser);
usersRouter.patch('/users/me', updateProfile);
usersRouter.patch('/users/me/avatar', updateAvatar);

module.exports = { usersRouter };
