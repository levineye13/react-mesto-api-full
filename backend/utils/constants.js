module.exports.regexpLink = /^https?:\/\/(www\.)?[\wа-яА-Я\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;=]+#?$/;

const allowedOrigins = [
  'http://www.api.ilovemesto.students.nomoreparties.xyz',
  'http://api.ilovemesto.students.nomoreparties.xyz',
  'https://www.api.ilovemesto.students.nomoreparties.xyz',
  'https://api.ilovemesto.students.nomoreparties.xyz',
  'http://ilovemesto.students.nomoreparties.xyz',
  'http://www.ilovemesto.students.nomoreparties.xyz',
  'https://ilovemesto.students.nomoreparties.xyz',
  'https://www.ilovemesto.students.nomoreparties.xyz',
];

const allowedMethods = 'HEAD,GET,PUT,PATCH,POST,DELETE,OPTIONS';

module.exports.corsConfig = {
  origin: allowedOrigins,
  methods: allowedMethods,
  credentials: true,
};
