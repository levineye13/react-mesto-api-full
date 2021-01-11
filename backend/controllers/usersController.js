const User = require('./../models/user');
const {
  STATUS_OK,
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
} = require('./../utils/constants');
const { handleError } = require('./../utils/utils');

/**
 * @param  {Object} req - объект запроса к серверу
 * @param  {Object} res - объект ответа сервера
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(NOT_FOUND_ERROR).send({ message: 'Пользователи не найдены' });
      return;
    }
    res.status(STATUS_OK).send(users);
  } catch (err) {
    handleError({
      responce: res,
      error: err,
      errorCode: INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * @param  {Object} req - объект запроса к серверу
 * @param  {Object} res - объект ответа сервера
 */
const getProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    return !user
      ? res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь не найден' })
      : res.status(STATUS_OK).send(user);
  } catch (err) {
    handleError({
      responce: res,
      error: err,
      errorCode: INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * Функция добавления пользователя
 * @param  {Object} req - объект запроса к серверу
 * @param  {Object} res - объект ответа сервера
 */
const createUser = async (req, res) => {
  const { name, about, avatar } = req.body;
  try {
    const newUser = await User.create({ name, about, avatar });
    res.status(STATUS_OK).send(newUser);
  } catch (err) {
    handleError({
      responce: res,
      error: err,
      errorCode:
        err.name === 'ValidationError'
          ? BAD_REQUEST_ERROR
          : INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * Функция обновления профиля
 * @param  {Object} req - объект запроса к серверу
 * @param  {Object} res - объект ответа сервера
 */
const updateProfile = async (req, res) => {
  const { _id } = req.user;
  const { name, about } = req.body;
  try {
    const updatedProfile = await User.findByIdAndUpdate(
      _id,
      { name, about },
      { new: true, runValidators: true, upsert: true }
    );
    res.status(STATUS_OK).send(updatedProfile);
  } catch (err) {
    handleError({
      responce: res,
      error: err,
      errorCode:
        err.name === 'ValidationError'
          ? BAD_REQUEST_ERROR
          : INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * Функция обновления аватара
 * @param  {Object} req - объект запроса к серверу
 * @param  {Object} res - объект ответа сервера
 */
const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { avatar } = req.body;
  try {
    const updatedAvatar = await User.findByIdAndUpdate(
      _id,
      { avatar },
      { new: true, runValidators: true, upsert: true }
    );
    res.status(STATUS_OK).send(updatedAvatar);
  } catch (err) {
    handleError({
      responce: res,
      error: err,
      errorCode:
        err.name === 'ValidationError'
          ? BAD_REQUEST_ERROR
          : INTERNAL_SERVER_ERROR,
    });
  }
};

module.exports = {
  getAllUsers,
  getProfile,
  createUser,
  updateProfile,
  updateAvatar,
};
