require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const cors = require('cors');

const { login, createUser } = require('./controllers/usersController');
const { cardsRouter } = require('./routes/cards');
const { usersRouter } = require('./routes/users');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const handleError = require('./middlewares/handleError');

const { PORT } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb-15', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

//Парсер кук
app.use(cookieParser());

//Парсер тела запросов
app.use(bodyParser.json());

//Логгер запросов
app.use(requestLogger);

//Политика CORS
app.use(
  cors({
    origin: 'ilovemesto.students.nomoreparties.xyz',
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  })
);

//Регистрация
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
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
