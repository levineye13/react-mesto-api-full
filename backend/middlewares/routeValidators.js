const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const validateAuthentication = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email()
      .message('Поле "email" должно быть валидным url-адресом')
      .messages({
        'any.required': 'Поле "email" должно быть заполнено',
      }),
    password: Joi.string().required().min(8).messages({
      'any.required': 'Поле "password" должно быть заполнено',
    }),
  }),
});

const validateUserBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email()
      .message('Поле "email" должно быть валидным url-адресом')
      .messages({
        'any.required': 'Поле "email" должно быть заполнено',
      }),
    password: Joi.string().required().min(8).messages({
      'any.required': 'Поле "password" должно быть заполнено',
    }),
    name: Joi.string().min(2).max(30).messages({
      'string.min': 'Минимальная длина поля "name" - 2',
      'string.max': 'Максимальная длина поля "name" - 30',
    }),
    about: Joi.string().min(2).max(30).messages({
      'string.min': 'Минимальная длина поля "about" - 2',
      'string.max': 'Максимальная длина поля "about" - 30',
    }),
    avatar: Joi.string().custom((value, helpers) => {
      return validator.isURL(value)
        ? value
        : helpers.message('Поле "avatar" должно быть валидным url-адресом');
    }),
  }),
});

module.exports = {
  validateAuthentication,
  validateUserBody,
};
