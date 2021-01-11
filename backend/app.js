const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { login, createUser } = require('./controllers/usersController');
const { cardsRouter } = require('./routes/cards');
const { usersRouter } = require('./routes/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '5fd38b1f1e10150ffcc87c4c',
  };

  next();
});
app.post('/signup', createUser);
app.post('/signin', login);
app.use(auth);
app.use(usersRouter);
app.use(cardsRouter);

//Возвращаем объект ошибки для всех остальных запросов
app.all('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
