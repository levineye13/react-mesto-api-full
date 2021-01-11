const usersRouter = require('express').Router();
const {
  getAllUsers,
  getProfile,
  createUser,
  updateProfile,
  updateAvatar,
} = require('./../controllers/usersController.js');

usersRouter.get('/users', getAllUsers);
usersRouter.get('/users/:userId', getProfile);
usersRouter.post('/users', createUser);
usersRouter.patch('/users/me', updateProfile);
usersRouter.patch('/users/me/avatar', updateAvatar);

module.exports = { usersRouter };
