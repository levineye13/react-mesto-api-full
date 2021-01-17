const mongoose = require('mongoose');

const { regexpLink } = require('../utils/constants');

const { Schema } = mongoose;

const ownerSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

const likeSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    default: [],
  },
});

const cardSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => regexpLink.test(v),
    },
  },
  owner: ownerSchema,
  likes: [
    { likeSchema },
  ],
  crearedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
