import { JWT } from './constants';

class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  /**
   * Метод обработки ответа сервера
   *
   * @param  {Object} res - объект ответа сервера
   */
  _checkResponceStatus = async (res) => {
    if (res.ok) {
      return res.json();
    }
    throw new Error(`Ошибка: ${res.status} - ${res.statusText}`);
  };

  /**
   * Метод получения информации о пользователе с сервера
   *
   * @return {Object}
   */
  getUserInfo = async () => {
    const jwt = localStorage.getItem(JWT);
    try {
      const res = await fetch(`${this._baseUrl}/users/me`, {
        method: 'GET',
        headers: {
          ...this._headers,
          authorization: `Bearer ${jwt}`,
        },
      });

      return this._checkResponceStatus(res);
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Метод получения карточек с сервера
   *
   * @return {Object}
   */
  getInitialCards = async () => {
    const jwt = localStorage.getItem(JWT);
    try {
      const res = await fetch(`${this._baseUrl}/cards`, {
        method: 'GET',
        headers: {
          ...this._headers,
          authorization: `Bearer ${jwt}`,
        },
      });

      return this._checkResponceStatus(res);
    } catch (err) {
      console.error(err);
    }
  };

  getAllInitialData = async () => {
    return Promise.allSettled([this.getUserInfo(), this.getInitialCards()]);
  };

  setUserInfo = async ({ name, about }) => {
    const jwt = localStorage.getItem(JWT);
    try {
      const res = await fetch(`${this._baseUrl}/users/me`, {
        method: 'PATCH',
        headers: {
          ...this._headers,
          authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          name,
          about,
        }),
      });
      return this._checkResponceStatus(res);
    } catch (err) {
      console.error(err);
    }
  };

  addCard = async ({ name, link }) => {
    const jwt = localStorage.getItem(JWT);
    try {
      const res = await fetch(`${this._baseUrl}/cards`, {
        method: 'POST',
        headers: {
          ...this._headers,
          authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          name,
          link,
        }),
      });
      return this._checkResponceStatus(res);
    } catch (err) {
      console.error(err);
    }
  };

  deleteCard = async (cardId) => {
    const jwt = localStorage.getItem(JWT);
    try {
      const res = await fetch(`${this._baseUrl}/cards/${cardId}`, {
        method: 'DELETE',
        headers: {
          ...this._headers,
          authorization: `Bearer ${jwt}`,
        },
      });
      return this._checkResponceStatus(res);
    } catch (err) {
      console.error(err);
    }
  };

  changeLikeCardStatus = async (cardId, methodHTTP) => {
    const jwt = localStorage.getItem(JWT);
    try {
      const res = await fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
        method: methodHTTP,
        headers: {
          ...this._headers,
          authorization: `Bearer ${jwt}`,
        },
      });
      return this._checkResponceStatus(res);
    } catch (err) {
      console.error(err);
    }
  };

  updateUserAvatar = async (avatar) => {
    const jwt = localStorage.getItem(JWT);
    try {
      const res = await fetch(`${this._baseUrl}/users/me/avatar`, {
        method: 'PATCH',
        headers: {
          ...this._headers,
          authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          avatar,
        }),
      });
      return this._checkResponceStatus(res);
    } catch (err) {
      console.error(err);
    }
  };

  register = async ({ email, password }) => {
    try {
      const res = await fetch(`${this._baseUrl}/signup`, {
        method: 'POST',
        headers: this._headers,
        body: JSON.stringify({
          email,
          password,
        }),
      });
      return this._checkResponceStatus(res);
    } catch (err) {
      console.error(`${err.name} - ${err.message}`);
    }
  };

  authorize = async ({ password, email }) => {
    try {
      const res = await fetch(`${this._baseUrl}/signin`, {
        method: 'POST',
        headers: this._headers,
        body: JSON.stringify({
          password,
          email,
        }),
      });

      return this._checkResponceStatus(res);
    } catch (err) {
      console.error(`${err.name} - ${err.message}`);
    }
  };
}

//Экземпляр Api для осуществления запросов к серверу
export const api = new Api({
  baseUrl: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});
