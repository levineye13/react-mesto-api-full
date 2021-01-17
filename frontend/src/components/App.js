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
import { JWT, signIn, signUp } from '../utils/constants';
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
   * Обработчик открытия попапа c всплывающей подсказкой
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
   * Обработчик закрытия попапа кликом по экрану
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
   * Обработчик удаления карточки по клику на кнопку
   * @param  {Object} card - карточка
   */
  const handleDeleteButtonClick = (card) => {
    setConfirmPopupOpen(true);
    setRemovableCard(card);
  };

  /**
   * Обработчик обновления информации о пользователе
   * @param  {String} name - никнейм пользователя
   * @param  {String} about - дополнительная информация о пользователе
   */
  const handleUpdateUser = async ({ name, about }) => {
    try {
      const res = await api.setUserInfo({ name, about });
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
   * Обработчик обновления аватарки
   * @param  {String} {avatar} - ссылка на картинку
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
   * Обработчик лайка/дислайка карточки
   * @param  {Object} card - карточка
   */
  const handleCardLike = async (card) => {
    const isLiked = card.likes.some((like) => currentUser._id === like._id);

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
   * Обработчик удаления карточки
   * @param  {Object} card - карточка
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
   * Обработчик добавления карточки
   * @param  {String} name - название места
   * @param  {String} link - ссылка на картинку
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

  /**
   * Обработчик авторизации пользователя
   * @param  {String} password
   * @param  {String} email
   */
  const handleAuthorization = async ({ password, email }) => {
    try {
      const data = await auth.authorize({ password, email });
      if (!data.hasOwnProperty('error')) {
        setLoggedIn(true);
        localStorage.setItem(JWT, data.token);
        history.push('/');
      }
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Обработчик регистрации пользователя
   * @param  {String} password
   * @param  {String} email
   */
  const handleRegistration = async ({ password, email }) => {
    try {
      const data = await auth.register({ password, email });
      if (data.hasOwnProperty('error')) {
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
   * Обработчик проверки токена
   */
  const handleCheckToken = async () => {
    try {
      const { data } = await auth.checkToken({
        token: localStorage.getItem(JWT),
      });
      if (data) {
        setLoggedIn(true);
        setAuthorizedUserData(data);
        history.push('/');
      } else {
        localStorage.removeItem(JWT);
      }
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Эффект, выполняющий авторизацию пользователя при монтировании,
   * если токен прошел проверку
   */
  useEffect(() => {
    const jwt = localStorage.getItem(JWT);

    if (jwt) {
      handleCheckToken();
    }
  }, []);

  /**
   * Отрисовка первоначальных данных при монтировании компонента.
   * (Promise.allSettled)
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataArray = await api.getAllInitialData();
        const [dataUser, dataCards] = dataArray.map((item) => item.value);

        if (dataUser) {
          setCurrentUser(dataUser);
        }

        if (dataCards) {
          setCards(dataCards);
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
          />
          <Switch>
            <Route path={signIn}>
              <Login
                onAuthorization={handleAuthorization}
                onCheckToken={handleCheckToken}
              />
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
