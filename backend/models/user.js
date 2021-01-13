const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const regexp = /^https?:\/\/(www\.)?[\wа-яА-Я\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;=]+#?$/;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator: (v) => regexp.test(v),
    },
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
});

userSchema.statics.findUserByCredentials = async function ({
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
    throw new Error('Неправильные почта или пароль');
  }

  const compare = await bcrypt.compare(password, user.password);
  if (!compare) {
    throw new Error('Неправильные почта или пароль');
  }

  return user;
};

module.exports = mongoose.model('user', userSchema);
