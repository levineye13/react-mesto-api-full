require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');

const { login, createUser } = require('./controllers/usersController');
const { cardsRouter } = require('./routes/cards');
const { usersRouter } = require('./routes/users');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const handleError = require('./middlewares/handleError');
const { regexpLink } = require('./utils/constants');

const { PORT } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(bodyParser.json());

//Логгер запросов
app.use(requestLogger);

//Регистрация
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
      about: Joi.string().min(2).max(30).default('Исследователь'),
      avatar: Joi.string()
        .min(2)
        .max(30)
        .pattern(regexpLink)
        .default(
          'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'
        ),
    }),
  }),
  createUser
);

//Авторизация
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login
);

//Проверка авторизации
app.use(auth);

// app.use(
//   celebrate({
//     headers: Joi.object().keys({
//       Authorization: Joi.string()
//         .required()
//         .pattern(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_=]*$/),
//     }),
//   }),
//   auth
// );

app.use(usersRouter);
app.use(cardsRouter);

//Возвращаем объект ошибки для всех остальных запросов
app.all('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

//Логгер ошибок
app.use(errorLogger);

//Обработчик ошибок celebrate
app.use(errors());

//Централизованный обработчик ошибок
app.use(handleError);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
