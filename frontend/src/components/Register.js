import React from 'react';
import { Link } from 'react-router-dom';
import PopupWithForm from './PopupWithForm';
import { useFormWithValidation } from '../hooks/useFormWithValidation';
import { signIn } from '../utils/constants';

const Register = ({ onRegistration }) => {
  const {
    values,
    handleInputChange,
    errors,
    isValid,
  } = useFormWithValidation();

  const handleSubmit = (evt) => {
    evt.preventDefault();

    onRegistration({
      password: values.password,
      email: values.email,
    });
  };

  const markup = (
    <fieldset className="popup__info">
      <label className="popup__form-field">
        <input
          value={values.email || ''}
          onChange={handleInputChange}
          type="email"
          id="email-input"
          className="popup__input popup__input_theme_dark"
          name="email"
          placeholder="Email"
          required
          maxLength="30"
        />
        <span className="popup__error" id="place-input-error">
          {errors.email || ''}
        </span>
      </label>
      <label className="popup__form-field">
        <input
          value={values.password || ''}
          onChange={handleInputChange}
          type="password"
          id="password-input"
          className="popup__input popup__input_theme_dark"
          name="password"
          placeholder="Пароль"
          required
        />
        <span className="popup__error" id="link-input-error">
          {errors.password || ''}
        </span>
      </label>
    </fieldset>
  );

  const linkMarkup = (
    <Link to={signIn} className="popup__link">
      Уже зарегистрированы? Войти
    </Link>
  );

  return (
    <PopupWithForm
      title={'Регистрация'}
      name={'register'}
      buttonText={'Зарегистрироваться'}
      children={markup}
      isOpen={true}
      link={linkMarkup}
      hasCloseButton={false}
      onClose={null}
      onScreenClickClose={null}
      onSubmit={handleSubmit}
      isValid={isValid}
    />
  );
};

export default Register;
