const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const { UnauthorizedError } = require('../errors');

const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Поле "email" должно быть заполнено'],
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Поле "email" должно быть валидным url-адресом',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле "password" должно быть заполнено'],
    minlength: 8,
    select: false,
  },
  name: {
    type: String,
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'Минимальная длина поля "about" - 2'],
    maxlength: [30, 'Максимальная длина поля "about" - 30'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Поле "avatar" должно быть валидным url-адресом',
    },
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
});

userSchema.statics.findUserByCredentials = async function findUserByCredentials({
  email,
  password,
}) {
  let user = null;
  try {
    user = await this.findOne({ email }).select('+password');
  } catch (err) {
    return err;
  }

  if (!user) {
    throw new UnauthorizedError('Неправильные почта или пароль');
  }

  const compare = await bcrypt.compare(password, user.password);
  if (!compare) {
    throw new UnauthorizedError('Неправильные почта или пароль');
  }

  return user;
};

module.exports = mongoose.model('user', userSchema);
