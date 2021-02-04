require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');

const { allowedOrigins, allowedMethods } = require('./utils/constants');
const routes = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/rateLimiter');
const handleError = require('./middlewares/handleError');
const { BadRequestError } = require('./errors/errors');

const {
  PORT, MONGO_DB_IP, MONGO_DB_PORT, MONGO_DB_NAME,
} = process.env;

const app = express();

mongoose.connect(`mongodb://${MONGO_DB_IP}:${MONGO_DB_PORT}/${MONGO_DB_NAME}`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// Ограничение количества запросов
app.use(limiter);

// Парсер кук
app.use(cookieParser());

// Парсер тела запросов
app.use(bodyParser.json());

// Логгер запросов
app.use(requestLogger);

// Политика CORS
app.use(
  cors({
    origin: allowedOrigins,
    methods: allowedMethods,
    credentials: true,
  }),
);

app.use(routes);

// Возвращаем объект ошибки для всех остальных запросов
app.all('*', () => {
  throw new BadRequestError('Запрашиваемый ресурс не найден');
});

// Логгер ошибок
app.use(errorLogger);

// Обработчик ошибок celebrate
app.use(errors());

// Централизованный обработчик ошибок
app.use(handleError);

app.listen(PORT);
