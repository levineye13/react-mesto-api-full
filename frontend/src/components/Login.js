import React from 'react';
import PopupWithForm from './PopupWithForm';
import { useFormWithValidation } from '../hooks/useFormWithValidation';

const Login = ({ onAuthorization, onCheckToken }) => {
  const {
    values,
    handleInputChange,
    errors,
    isValid,
  } = useFormWithValidation();

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    await onAuthorization({
      password: values.password,
      email: values.email,
    });
    //вызываем функцию проверки токена, чтобы получить email
    await onCheckToken();
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

  return (
    <PopupWithForm
      title={'Вход'}
      name={'login'}
      buttonText={'Войти'}
      children={markup}
      isOpen={true}
      link={null}
      hasCloseButton={false}
      onClose={null}
      onScreenClickClose={null}
      onSubmit={handleSubmit}
      isValid={isValid}
    />
  );
};

export default Login;
