require('dotenv').config();

const {
  NODE_ENV = 'development',
  PORT = 3000,
  JWT_SECRET = 'JWT_SECRET',
  MONGO_DB_PORT = 27017,
  MONGO_DB_IP = '127.0.0.1',
  MONGO_DB_NAME = 'mestodb-15',
} = process.env;

module.exports = {
  NODE_ENV,
  PORT,
  JWT_SECRET,
  MONGO_DB_PORT,
  MONGO_DB_IP,
  MONGO_DB_NAME,
};
