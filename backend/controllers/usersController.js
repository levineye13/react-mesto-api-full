const { NODE_ENV, JWT_SECRET } = process.env;
const User = require('./../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
} = require('./../errors/errors');

/**
 * Функция авторизации.
 *
 * @param  {Object} req - объект запроса к серверу
 * @param  {Object} res - объект ответа сервера
 * @param  {Function} next - функция промежуточной обработки
 *
 * @returns Cookie httpOnly
 */
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

    res
      .status(204)
      .cookie('jwt', `Bearer ${token}`, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      })
      .end();
  } catch (err) {
    next(err);
  }
};

/**
 * Функция выхода из системы. Просто очищает куки.
 *
 * @param  {Object} req - объект запроса к серверу
 * @param  {Object} res - объект ответа сервера
 * @param  {Function} next - функция промежуточной обработки
 */
const logout = (req, res, next) => {
  try {
    res.status(204).clearCookie('jwt').end();
  } catch (err) {
    next(err);
  }
};

/**
 * Функция проверяет, авторизован ли пользователь.
 * Метод http HEAD. Если пользователь авторизован (имеется поле _id), возвращает только статус 204.
 *
 * @param  {Object} req - объект запроса к серверу
 * @param  {Object} res - объект ответа сервера
 * @param  {Function} next - функция промежуточной обработки
 */
const checkAuth = async (req, res, next) => {
  const { _id } = req.user;

  try {
    if (!_id) {
      throw new UnauthorizedError('Требуется авторизация');
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

/**
 * Функция возвращает данные текущего пользователя.
 *
 * @param  {Object} req - объект запроса к серверу
 * @param  {Object} res - объект ответа сервера
 * @param  {Function} next - функция промежуточной обработки
 */
const getCurrentUser = async (req, res, next) => {
  const { _id } = req.user;

  try {
    if (!_id) {
      throw new NotFoundError('Пользователь не найден');
    }
    const user = await User.findById({ _id });
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.status(200).send({
      _id: user._id,
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Функция возвращает всех пользователей.
 *
 * @param  {Object} req - объект запроса к серверу
 * @param  {Object} res - объект ответа сервера
 * @param  {Function} next - функция промежуточной обработки
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
 * Функция возвращает пользователя по id.
 *
 * @param  {Object} req - объект запроса к серверу
 * @param  {Object} res - объект ответа сервера
 * @param  {Function} next - функция промежуточной обработки
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
 * Функция добавления пользователя.
 *
 * @param  {Object} req - объект запроса к серверу
 * @param  {Object} res - объект ответа сервера
 * @param  {Function} next - функция промежуточной обработки
 */
const createUser = async (req, res, next) => {
  const {
    email,
    password,
    name = 'Жак-Ив Кусто',
    about = 'Исследователь',
    avatar = 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const user = await User.create({
      email,
      password: passwordHash,
      name,
      about,
      avatar,
    });
    res.status(201).send({
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    });
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
 * @param  {Function} next - функция промежуточной обработки
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
 *
 * @param  {Object} req - объект запроса к серверу
 * @param  {Object} res - объект ответа сервера
 * @param  {Function} next - функция промежуточной обработки
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
  logout,
  checkAuth,
  getCurrentUser,
  getAllUsers,
  getProfile,
  createUser,
  updateProfile,
  updateAvatar,
};
