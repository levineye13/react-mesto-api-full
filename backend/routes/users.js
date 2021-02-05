const usersRouter = require('express').Router();
const {
  logout,
  checkAuth,
  getCurrentUser,
  getAllUsers,
  getProfile,
  updateProfile,
  updateAvatar,
} = require('../controllers/usersController.js');
const {
  validateObjectId,
  validateUpdateUserInfo,
  validateUpdateUserAvatar,
} = require('../middlewares/routeValidators');

usersRouter.head('/signout', logout);

usersRouter.head('users/me', checkAuth);

usersRouter.get('/users', getAllUsers);

usersRouter.get('/users/me', getCurrentUser);

usersRouter.get('/users/:id', validateObjectId, getProfile);

usersRouter.patch('/users/me', validateUpdateUserInfo, updateProfile);

usersRouter.patch('/users/me/avatar', validateUpdateUserAvatar, updateAvatar);

module.exports = { usersRouter };
