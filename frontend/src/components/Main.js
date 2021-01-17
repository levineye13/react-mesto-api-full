import React, { useContext, useState, useEffect } from 'react';
import Card from './Card';
import { CurrentUserContext } from './../contexts/CurrentUserContext';
import Loader from '../components/Loader';

const Main = ({
  onEditProfile,
  onAddPlace,
  onEditAvatar,
  onCardClick,
  onDeleteButtonClick,
  cards,
  onCardLike,
}) => {
  const currentUser = useContext(CurrentUserContext);
  const [cardsLoaded, setCardsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setCardsLoaded(true), 1000);
  }, []);

  return (
    <main className="content page__content">
      <section className="profile content__profile">
        <div className="profile__avatar-container">
          <img
            src={currentUser.avatar || ''}
            alt={currentUser.name || ''}
            className="profile__avatar"
          />
          <button
            className="profile__update-button"
            type="button"
            onClick={onEditAvatar}
          />
        </div>
        <div className="profile__info">
          <h1 className="profile__title">{currentUser.name || ''}</h1>
          <button className="profile__edit-button" onClick={onEditProfile} />
          <p className="profile__subtitle">{currentUser.about || ''}</p>
        </div>
        <button className="profile__add-button" onClick={onAddPlace} />
      </section>
      <section className="elements content__elements">
        <ul className="elements__list">
          {cards.length > 0 ? (
            cards.map((card) => (
              <Card
                card={card}
                onCardClick={onCardClick}
                onDeleteButtonClick={onDeleteButtonClick}
                onCardLike={onCardLike}
                key={card._id}
              />
            ))
          ) : cardsLoaded ? (
            <p className="elements__baner">
              Пока не создано ни одной карточки!
            </p>
          ) : (
            <Loader />
          )}
        </ul>
      </section>
    </main>
  );
};

export default Main;
