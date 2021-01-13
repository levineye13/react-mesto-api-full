const { NODE_ENV, JWT_SECRET } = process.env;
const User = require('./../models/user');
const jwt = require('jsonwebtoken');
const {
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
} = require('./../errors/errors');

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials({ email, password });
    if (!user) {
      throw new UnauthorizedError('Неправильные почта или пароль');
    }
    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      {
        expiresIn: '7d',
      }
    );
    res.send({ token });
  } catch (err) {
    next(err);
  }
};

const getCurrentUser = async (req, res, next) => {
  const { _id } = req.user;
  try {
    const user = await User.findById({ _id });
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

/**
 * @param  {Object} req - объект запроса к серверу
 * @param  {Object} res - объект ответа сервера
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      throw new NotFoundError('Пользователи не найдены');
    }
    res.status(200).send(users);
  } catch (err) {
    next(err);
  }
};

/**
 * @param  {Object} req - объект запроса к серверу
 * @param  {Object} res - объект ответа сервера
 */
const getProfile = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

/**
 * Функция добавления пользователя
 * @param  {Object} req - объект запроса к серверу
 * @param  {Object} res - объект ответа сервера
 */
const createUser = async (req, res, next) => {
  const { email, password, name, about, avatar } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: passwordHash,
      name,
      about,
      avatar,
    });
    res.status(200).send(newUser);
  } catch (err) {
    next(
      err.name === 'ValidationError'
        ? new BadRequestError('Переданы некорректные данные')
        : err
    );
  }
};

/**
 * Функция обновления профиля
 * @param  {Object} req - объект запроса к серверу
 * @param  {Object} res - объект ответа сервера
 */
const updateProfile = async (req, res, next) => {
  const { _id } = req.user;
  const { name, about } = req.body;
  try {
    const updatedProfile = await User.findByIdAndUpdate(
      _id,
      { name, about },
      { new: true, runValidators: true, upsert: true }
    );
    res.status(200).send(updatedProfile);
  } catch (err) {
    next(
      err.name === 'ValidationError'
        ? new BadRequestError('Переданы некорректные данные')
        : err
    );
  }
};

/**
 * Функция обновления аватара
 * @param  {Object} req - объект запроса к серверу
 * @param  {Object} res - объект ответа сервера
 */
const updateAvatar = async (req, res, next) => {
  const { _id } = req.user;
  const { avatar } = req.body;
  try {
    const updatedAvatar = await User.findByIdAndUpdate(
      _id,
      { avatar },
      { new: true, runValidators: true, upsert: true }
    );
    res.status(200).send(updatedAvatar);
  } catch (err) {
    next(
      err.name === 'ValidationError'
        ? new BadRequestError('Переданы некорректные данные')
        : err
    );
  }
};

module.exports = {
  login,
  getCurrentUser,
  getAllUsers,
  getProfile,
  createUser,
  updateProfile,
  updateAvatar,
};
