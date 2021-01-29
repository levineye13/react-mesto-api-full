module.exports.regexpLink = /^https?:\/\/(www\.)?[\wа-яА-Я\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;=]+#?$/;

module.exports.allowedOrigins = [
  'http://www.api.ilovemesto.students.nomoreparties.xyz',
  'http://api.ilovemesto.students.nomoreparties.xyz',
  'https://www.api.ilovemesto.students.nomoreparties.xyz',
  'https://api.ilovemesto.students.nomoreparties.xyz',
  'http://ilovemesto.students.nomoreparties.xyz',
  'http://www.ilovemesto.students.nomoreparties.xyz',
  'https://ilovemesto.students.nomoreparties.xyz',
  'https://www.ilovemesto.students.nomoreparties.xyz',
];

module.exports.allowedMethods = 'HEAD,GET,PUT,PATCH,POST,DELETE,OPTIONS';

module.exports.DEFAULT_USER_INFO = {
  name: 'Жак-Ив Кусто',
  about: 'Исследователь',
  avatar:
    'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
};
