const mongoose = require('mongoose');

const { Schema } = mongoose;

const regexp = /^https?:\/\/(www\.)?[\wа-яА-Я\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;=]+#?$/;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v) => regexp.test(v),
    },
  },
});

module.exports = mongoose.model('user', userSchema);
