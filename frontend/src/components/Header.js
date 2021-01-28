import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { signIn, signUp } from '../utils/constants.js';
import headerLogo from '../images/header__logo.svg';

const Header = ({ loggedIn, email, onUnauthorization }) => {
  const { pathname: path } = useLocation();
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [isActiveButtonMenu, setActiveButtonMenu] = useState(false);

  const toggleButtonMenuState = () => {
    setActiveButtonMenu(!isActiveButtonMenu);
  };

  useEffect(() => {
    const setData = (path) => {
      if (path === signIn) {
        setText('Регистрация');
        setUrl(signUp);
      } else if (path === signUp) {
        setText('Войти');
        setUrl(signIn);
      }
    };

    setData(path);
  }, [path]);

  return (
    <header className="header page__header">
      <img src={headerLogo} alt="Логотип Место" className="header__logo" />
      <button className="header__button-menu" onClick={toggleButtonMenuState}>
        <span
          className={`header__button-element ${
            isActiveButtonMenu ? 'header__button-element_active' : ''
          }`}
        />
      </button>
      <ul
        className={`header__list ${
          isActiveButtonMenu ? 'header__list_opened' : ''
        }`}
      >
        <li className="header__item">
          <p className="header__email">
            {loggedIn ? (email ? email : '') : ''}
          </p>
        </li>
        <li className="header__item">
          {!loggedIn ? (
            <Link to={url} className="header__link">
              {text}
            </Link>
          ) : (
            <button
              className="header__button-output"
              onClick={async () => await onUnauthorization()}
              type="button"
            >
              Выйти
            </button>
          )}
        </li>
      </ul>
    </header>
  );
};

export default Header;
