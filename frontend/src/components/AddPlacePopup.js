import React, { useEffect } from 'react';
import PopupWithForm from './PopupWithForm';
import { useFormWithValidation } from './../hooks/useFormWithValidation';

const AddPlacePopup = ({ isOpen, onClose, onScreenClickClose, onAddPlace }) => {
  const {
    values,
    handleInputChange,
    errors,
    isValid,
    resetForm,
  } = useFormWithValidation();

  useEffect(() => {
    resetForm();
  }, [isOpen, resetForm]);

  const handleSubmit = (evt) => {
    evt.preventDefault();

    onAddPlace({
      name: values.place,
      link: values.link,
    });
  };

  const markup = (
    <fieldset className="popup__info">
      <label className="popup__form-field">
        <input
          value={values.place || ''}
          onChange={handleInputChange}
          type="text"
          id="place-input"
          className="popup__input"
          name="place"
          placeholder="Название"
          required
          maxLength="30"
        />
        <span className="popup__error" id="place-input-error">
          {errors.place || ''}
        </span>
      </label>
      <label className="popup__form-field">
        <input
          value={values.link || ''}
          onChange={handleInputChange}
          type="url"
          id="link-input"
          className="popup__input"
          name="link"
          placeholder="Ссылка на картинку"
          required
        />
        <span className="popup__error" id="link-input-error">
          {errors.link || ''}
        </span>
      </label>
    </fieldset>
  );

  return (
    <PopupWithForm
      title={'Новое место'}
      name={'add-card'}
      buttonText={'Создать'}
      children={markup}
      isOpen={isOpen}
      onClose={onClose}
      onScreenClickClose={onScreenClickClose}
      onSubmit={handleSubmit}
      isValid={isValid}
    />
  );
};

export default AddPlacePopup;
