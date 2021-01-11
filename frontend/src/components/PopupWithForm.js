import React from 'react';
import ReactDOM from 'react-dom';

const PopupWithForm = ({
  title,
  name,
  buttonText,
  children,
  isOpen,
  onClose,
  onScreenClickClose,
  onSubmit,
  isValid,
  link,
  hasCloseButton = true,
}) => {
  const isAuthPopup = name === 'register' || name === 'login';

  return (
    <section
      className={`popup popup_type_${name} ${
        isAuthPopup ? 'page__auth-popup' : ''
      } ${isOpen ? 'popup_opened' : ''}`}
      onClick={onScreenClickClose}
    >
      <div className="popup__wrapper">
        {hasCloseButton && (
          <button
            className="popup__close-button button"
            onClick={onClose}
            type="button"
          />
        )}
        <form
          action="#"
          id={name}
          className={`popup__form ${
            isAuthPopup ? 'popup__form_theme_dark' : ''
          }`}
          name={`popup-${name}`}
          onSubmit={onSubmit}
          noValidate
        >
          <h2
            className={`popup__title ${
              isAuthPopup ? 'popup__title_theme_dark' : ''
            }`}
          >
            {title}
          </h2>
          {children}
          <button
            className={`popup__save-button ${
              isAuthPopup ? 'popup__save-button_theme_dark' : ''
            } button ${isValid ? '' : 'button_inactive'}`}
            type="submit"
            disabled={!isValid}
          >
            {buttonText}
          </button>
          {link}
        </form>
      </div>
    </section>
  );
};

export default PopupWithForm;
