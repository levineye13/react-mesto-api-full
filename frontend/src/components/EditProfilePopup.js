import React, { useContext, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from './../contexts/CurrentUserContext';
import { useFormWithValidation } from './../hooks/useFormWithValidation';

const EditProfilePopup = ({
  isOpen,
  onClose,
  onScreenClickClose,
  onUpdateUser,
}) => {
  const currentUser = useContext(CurrentUserContext);
  const {
    values,
    handleInputChange,
    errors,
    isValid,
    resetForm,
  } = useFormWithValidation();

  useEffect(() => {
    if (currentUser) {
      resetForm(currentUser, {}, true);
    }
  }, [isOpen, currentUser, resetForm]);

  const handleSubmit = (evt) => {
    evt.preventDefault();

    onUpdateUser({
      name: values.name,
      about: values.about,
    });
  };

  const markup = (
    <fieldset className="popup__info">
      <label className="popup__form-field">
        <input
          type="text"
          id="name-input"
          className="popup__input"
          name="name"
          placeholder="Имя"
          required
          minLength="2"
          maxLength="40"
          value={values.name || ''}
          onChange={handleInputChange}
        />
        <span className="popup__error" id="name-input-error">
          {errors.name || ''}
        </span>
      </label>
      <label className="popup__form-field">
        <input
          type="text"
          id="job-input"
          className="popup__input"
          name="about"
          placeholder="О себе"
          required
          minLength="2"
          maxLength="200"
          value={values.about || ''}
          onChange={handleInputChange}
        />
        <span className="popup__error" id="job-input-error">
          {errors.about || ''}
        </span>
      </label>
    </fieldset>
  );

  return (
    <PopupWithForm
      title={'Редактировать профиль'}
      name={'profile'}
      buttonText={'Сохранить'}
      children={markup}
      isOpen={isOpen}
      onClose={onClose}
      onScreenClickClose={onScreenClickClose}
      onSubmit={handleSubmit}
      isValid={isValid}
    />
  );
};

export default EditProfilePopup;
