require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { login, createUser } = require('./controllers/usersController');
const { cardsRouter } = require('./routes/cards');
const { usersRouter } = require('./routes/users');
const auth = require('./middlewares/auth');
const { InternalServerError } = require('./errors/errors');

const { PORT } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(bodyParser.json());

app.post('/signup', createUser);
app.post('/signin', login);
app.use(auth);
app.use(usersRouter);
app.use(cardsRouter);

//Возвращаем объект ошибки для всех остальных запросов
app.all('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.use((err, req, res, next) => {
  const internalServerError = new InternalServerError();
  const { statusCode = internalServerError.statusCode, message } = err;

  res.status(statusCode).send({
    message:
      statusCode === internalServerError.statusCode
        ? internalServerError.message
        : message,
  });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
