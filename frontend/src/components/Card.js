import React from 'react';
import { CurrentUserContext } from './../contexts/CurrentUserContext';

const Card = function ({ card, onCardClick, onDeleteButtonClick, onCardLike }) {
  const currentUser = React.useContext(CurrentUserContext);
  const isOwn = currentUser._id === card.owner._id;
  const isLiked = card.likes.some((like) => currentUser._id === like._id);

  const handleClick = () => {
    onCardClick(card);
  };

  const handleDeleteButtonClick = () => {
    onDeleteButtonClick(card);
  };

  const handleLikeClick = () => {
    onCardLike(card, isLiked);
  };

  return (
    <li className="elements__item">
      <button
        className={`elements__delete-card ${
          isOwn ? '' : 'elements__delete-card_hidden'
        }`}
        onClick={handleDeleteButtonClick}
      />
      <img
        src={card.link}
        alt={card.name}
        className="elements__img"
        onClick={handleClick}
      />
      <div className="elements__container">
        <h2 className="elements__title">{card.name}</h2>
        <div className="elements__group">
          <button
            className={`elements__like-button ${
              isLiked ? 'elements__like-button_active' : ''
            }`}
            onClick={handleLikeClick}
          />
          <span className="elements__like-count">{card.likes.length}</span>
        </div>
      </div>
    </li>
  );
};

export default Card;
