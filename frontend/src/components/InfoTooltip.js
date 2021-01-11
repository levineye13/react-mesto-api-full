import React from 'react';
import ReactDOM from 'react-dom';

const InfoTooltip = ({ isOpen, onClose, onScreenClickClose, isSuccessful }) => {
  return (
    <section
      className={`popup popup_type_info-tooltip ${
        isOpen ? 'popup_opened' : ''
      }`}
      onClick={onScreenClickClose}
    >
      <div className="popup__wrapper popup__wrapper_type_info-tooltip">
        <button className={'popup__close-button button'} onClick={onClose} />
        <figure className="popup__img-container popup__img-container_type_info-tooltip">
          <div
            className={`popup__circle ${
              isSuccessful
                ? 'popup__circle_type_accept'
                : 'popup__circle_type_error'
            }`}
          ></div>
          <figcaption className="popup__title-img popup__title-img_type_info-tooltip">
            {isSuccessful
              ? 'Вы успешно зарегистрировались!'
              : 'Что-то пошло не так! Попробуйте ещё раз.'}
          </figcaption>
        </figure>
      </div>
    </section>
  );
};

export default InfoTooltip;
