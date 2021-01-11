import React, { useEffect } from 'react';
import PopupWithForm from './PopupWithForm';
import { useFormWithValidation } from './../hooks/useFormWithValidation';

const EditAvatarPopup = function ({
  isOpen,
  onClose,
  onScreenClickClose,
  onUpdateAvatar,
}) {
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

    onUpdateAvatar({
      avatar: values.link,
    });
  };

  const markup = (
    <fieldset className="popup__info">
      <label className="popup__form-field">
        <input
          value={values.link || ''}
          onChange={handleInputChange}
          type="url"
          id="input-link"
          className="popup__input"
          name="link"
          placeholder="Ссылка на картинку"
          required
        />
        <span className="popup__error" id="input-link-error">
          {errors.link || ''}
        </span>
      </label>
    </fieldset>
  );

  return (
    <PopupWithForm
      title={'Обновить аватар'}
      name={'update-avatar'}
      buttonText={'Обновить'}
      children={markup}
      isOpen={isOpen}
      onClose={onClose}
      onScreenClickClose={onScreenClickClose}
      onSubmit={handleSubmit}
      isValid={isValid}
    />
  );
};

export default EditAvatarPopup;
