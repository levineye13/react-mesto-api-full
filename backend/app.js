const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');

const { corsConfig } = require('./utils/constants');
const routes = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/rateLimiter');
const handleError = require('./middlewares/handleError');
const { BadRequestError } = require('./errors');

const {
  PORT, MONGO_DB_IP, MONGO_DB_PORT, MONGO_DB_NAME,
} = require('./config');

const app = express();

mongoose.connect(`mongodb://${MONGO_DB_IP}:${MONGO_DB_PORT}/${MONGO_DB_NAME}`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Ограничение количества запросов
app.use(limiter);

// Парсер кук
app.use(cookieParser());

// Парсер тела запросов
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Логгер запросов
app.use(requestLogger);

// Политика CORS
app.use(cors(corsConfig));

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
