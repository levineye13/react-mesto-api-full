import React, { useState, useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import ProtectedRoute from '../hoc/ProtectedRoute';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import Login from './Login';
import Register from './Register';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ConfirmDeleteCardPopup from './ConfirmDeleteCardPopup';
import InfoTooltip from './InfoTooltip';
import { api } from '../utils/api';
import { CurrentUserContext } from './../contexts/CurrentUserContext';
import avatarImg from './../images/profile__avatar.jpg';
import { signIn, signUp } from '../utils/constants';
import { splitDataArray } from '../utils/utils';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [isConfirmPopupOpen, setConfirmPopupOpen] = useState(false);
  const [isInfoTooltipPopup, setInfoTooltipPopup] = useState(false);
  const [isSuccessfulRegistration, setSuccessfulRegistration] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cards, setCards] = useState([]);
  const [removableCard, setRemovableCard] = useState(null);

  const history = useHistory();

  //Дефолтная инициализация в случае невыполнения запроса к api.
  const [currentUser, setCurrentUser] = useState({
    email: 'email',
    avatar: avatarImg,
    name: 'Name',
    about: 'Information about you',
  });

  /**
   * Обработчик открытия попапа c всплывающей подсказкой.
   *
   * @param  {Boolean} isSuccessful - успешность регистрации
   */
  const handleInfoTooltipOpen = (isSuccessful) => {
    setSuccessfulRegistration(isSuccessful);
    setInfoTooltipPopup(true);
  };

  /**
   * Обработчик открытия попапа редактирования профиля.
   */
  const handleEditProfileClick = () => {
    setEditProfilePopupOpen(true);
  };

  /**
   * Обработчик открытия попапа добавления карточки.
   */
  const handleAddPlaceClick = () => {
    setAddPlacePopupOpen(true);
  };

  /**
   * Обработчик открытия попапа редактирования аватара.
   */
  const handleEditAvatarClick = () => {
    setEditAvatarPopupOpen(true);
  };

  /**
   * Обработчик закрытия попапов.
   */
  const closeAllPopups = () => {
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setConfirmPopupOpen(false);
    setInfoTooltipPopup(false);
    setSelectedCard(null);
  };

  /**
   * Обработчик закрытия попапа кликом по экрану.
   *
   * @param  {Object} {target} - event target
   */
  const handleScreenClickClose = ({ target }) => {
    if (target.classList.contains('popup')) {
      closeAllPopups();
    }
  };

  /**
   * Обработчик клика по карточке.
   */
  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  /**
   * Обработчик удаления карточки по клику на кнопку.
   *
   * @param  {Object} card - карточка
   */
  const handleDeleteButtonClick = (card) => {
    setConfirmPopupOpen(true);
    setRemovableCard(card);
  };

  /**
   * Обработчик обновления информации о пользователе.
   *
   * @param  {String} name - никнейм пользователя
   * @param  {String} about - дополнительная информация о пользователе
   * @async
   */
  const handleUpdateUser = async ({ name, about }) => {
    try {
      const res = await api.setUser({ name, about });
      if (res) {
        setCurrentUser(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      closeAllPopups();
    }
  };

  /**
   * Обработчик обновления аватарки.
   *
   * @param  {String} {avatar} - ссылка на картинку
   * @async
   */
  const handleUpdateAvatar = async ({ avatar }) => {
    try {
      const res = await api.updateUserAvatar(avatar);
      if (res) {
        setCurrentUser(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      closeAllPopups();
    }
  };

  /**
   * Обработчик лайка/дислайка карточки.
   *
   * @param  {Object} card - карточка
   * @async
   */
  const handleCardLike = async (card, isLiked) => {
    try {
      const newCard = await api.changeLikeCardStatus(
        card._id,
        isLiked ? 'DELETE' : 'PUT'
      );
      if (newCard) {
        const newCards = cards.map((currentCard) =>
          currentCard._id === card._id ? newCard : currentCard
        );
        setCards(newCards);
      }
    } catch (err) {
      console.error(err);
    } finally {
      closeAllPopups();
    }
  };

  /**
   * Обработчик удаления карточки.
   *
   * @param  {Object} card - карточка
   * @async
   */
  const handleCardDelete = async (card) => {
    try {
      await api.deleteCard(card._id);
      closeAllPopups();

      const newCards = cards.filter(
        (currentCard) => currentCard._id !== card._id
      );

      setCards(newCards);
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Обработчик добавления карточки.
   *
   * @param  {String} name - название места
   * @param  {String} link - ссылка на картинку
   * @async
   */
  const handleAddPlaceSubmit = async ({ name, link }) => {
    try {
      const newCard = await api.addCard({ name, link });
      closeAllPopups();

      if (newCard) {
        setCards([newCard, ...cards]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const setAuthorization = ({ isLoggedIn, path }) => {
    setLoggedIn(isLoggedIn);
    history.push(path);
  };

  /**
   * Обработчик авторизации пользователя.
   *
   * @param  {String} password
   * @param  {String} email
   * @async
   */
  const handleAuthorization = async ({ password, email }) => {
    try {
      const res = await api.authorize({ password, email });
      if (res) {
        setAuthorization({ isLoggedIn: true, path: '/' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Функция логаута пользователя.
   *
   * @async
   */
  const handleUnauthorization = async () => {
    try {
      const res = await api.unauthorize();
      if (res) {
        setAuthorization({ isLoggedIn: false, path: signIn });
      }
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Обработчик регистрации пользователя
   *
   * @param  {String} password
   * @param  {String} email
   * @async
   */
  const handleRegistration = async ({ email, password }) => {
    try {
      const data = await api.register({ email, password });

      if (!data) {
        handleInfoTooltipOpen(false);
      } else {
        history.push(signIn);
        handleInfoTooltipOpen(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Функция установки данных о пользователе и карточках.
   * Используется Promise.allSettled, чтобы отобразить все успешные промисы.
   *
   * @async
   */
  const setData = async () => {
    try {
      const data = await api.getAllInitialData();
      const [userInfo, cardsInfo] = splitDataArray(data);
      if (userInfo) {
        setCurrentUser(userInfo);
      }
      if (cardsInfo) {
        setCards(cardsInfo);
      }
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Отрисовка первоначальных данных при монтировании компонента,
   * если пользователь авторизован.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.checkAuth();
        if (res) {
          await setData();
          setAuthorization({ isLoggedIn: true, path: '/' });
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  //Обработчик закрытия попапа по клику на Escape
  useEffect(() => {
    const handleEscClickClose = (evt) => {
      if (evt.key === 'Escape') {
        closeAllPopups();
      }
    };

    document.addEventListener('keydown', handleEscClickClose);

    return () => {
      document.removeEventListener('keydown', handleEscClickClose);
    };
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="App">
        <div className="page">
          <Header
            loggedIn={loggedIn}
            setLoggedIn={setLoggedIn}
            email={currentUser.email}
            onUnauthorization={handleUnauthorization}
          />
          <Switch>
            <Route path={signIn}>
              <Login onAuthorization={handleAuthorization} setData={setData} />
            </Route>
            <Route path={signUp}>
              <Register onRegistration={handleRegistration} />
            </Route>
            <ProtectedRoute
              component={Main}
              loggedIn={loggedIn}
              path="/"
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onCardClick={handleCardClick}
              onDeleteButtonClick={handleDeleteButtonClick}
              cards={cards}
              onCardLike={handleCardLike}
            />
          </Switch>
          <Footer />
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onScreenClickClose={handleScreenClickClose}
            onUpdateUser={handleUpdateUser}
          />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onScreenClickClose={handleScreenClickClose}
            onUpdateAvatar={handleUpdateAvatar}
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onScreenClickClose={handleScreenClickClose}
            onAddPlace={handleAddPlaceSubmit}
          />
          <ConfirmDeleteCardPopup
            isOpen={isConfirmPopupOpen}
            onClose={closeAllPopups}
            onScreenClickClose={handleScreenClickClose}
            onDeleteCard={handleCardDelete}
            card={removableCard}
          />
          <ImagePopup
            card={selectedCard}
            onClose={closeAllPopups}
            onScreenClickClose={handleScreenClickClose}
          />
          <InfoTooltip
            isOpen={isInfoTooltipPopup}
            onClose={closeAllPopups}
            onScreenClickClose={handleScreenClickClose}
            isSuccessful={isSuccessfulRegistration}
          />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
};

export default App;
