module.exports.regexpLink = /^https?:\/\/(www\.)?[\wа-яА-Я\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;=]+#?$/;

module.exports.allowedCors = [
  'http://www.api.ilovemesto.students.nomoreparties.xyz',
  'http://api.ilovemesto.students.nomoreparties.xyz',
  'https://www.api.ilovemesto.students.nomoreparties.xyz',
  'https://api.ilovemesto.students.nomoreparties.xyz',
  'http://ilovemesto.students.nomoreparties.xyz',
  'http://www.ilovemesto.students.nomoreparties.xyz',
  'https://ilovemesto.students.nomoreparties.xyz',
  'https://www.ilovemesto.students.nomoreparties.xyz',
];

module.exports.allowedMethods = 'GET,PUT,PATCH,POST,DELETE,OPTIONS';
