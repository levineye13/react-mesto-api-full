class Api {
  constructor({ baseUrl, headers, extraOptions }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
    this._extraOptions = extraOptions;
  }

  /**
   * Метод обработки ответа сервера
   *
   * @param  {Object} res - объект ответа сервера
   */
  _handleResponceWithBody = async (res) => {
    if (res.ok) {
      return res.json();
    }
    throw new Error(`Ошибка: ${res.status} - ${res.statusText}`);
  };

  _handleResponceWithoutBody = (res) => {
    return res.ok ? true : false;
  };

  /**
   * Метод получения информации о пользователе с сервера
   *
   * @return {Object}
   */
  getUser = async () => {
    try {
      const res = await fetch(`${this._baseUrl}/users/me`, {
        method: 'GET',
        ...this._extraOptions,
        headers: this._headers,
      });

      return this._handleResponceWithBody(res);
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
    try {
      const res = await fetch(`${this._baseUrl}/cards`, {
        method: 'GET',
        ...this._extraOptions,
        headers: this._headers,
      });

      return this._handleResponceWithBody(res);
    } catch (err) {
      console.error(err);
    }
  };

  getAllInitialData = async () => {
    return Promise.allSettled([this.getUser(), this.getInitialCards()]);
  };

  getInitialData = async () => {
    return Promise.all([this.getUser(), this.getInitialCards()]);
  };

  setUser = async ({ name, about }) => {
    try {
      const res = await fetch(`${this._baseUrl}/users/me`, {
        method: 'PATCH',
        ...this._extraOptions,
        headers: this._headers,

        body: JSON.stringify({
          name,
          about,
        }),
      });
      return this._handleResponceWithBody(res);
    } catch (err) {
      console.error(err);
    }
  };

  addCard = async ({ name, link }) => {
    try {
      const res = await fetch(`${this._baseUrl}/cards`, {
        method: 'POST',
        ...this._extraOptions,
        headers: this._headers,

        body: JSON.stringify({
          name,
          link,
        }),
      });
      return this._handleResponceWithBody(res);
    } catch (err) {
      console.error(err);
    }
  };

  deleteCard = async (cardId) => {
    try {
      const res = await fetch(`${this._baseUrl}/cards/${cardId}`, {
        method: 'DELETE',
        ...this._extraOptions,
        headers: this._headers,
      });
      return this._handleResponceWithBody(res);
    } catch (err) {
      console.error(err);
    }
  };

  changeLikeCardStatus = async (cardId, methodHTTP) => {
    try {
      const res = await fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
        method: methodHTTP,
        ...this._extraOptions,
        headers: this._headers,
      });
      return this._handleResponceWithBody(res);
    } catch (err) {
      console.error(err);
    }
  };

  updateUserAvatar = async (avatar) => {
    try {
      const res = await fetch(`${this._baseUrl}/users/me/avatar`, {
        method: 'PATCH',
        ...this._extraOptions,
        headers: this._headers,
        body: JSON.stringify({
          avatar,
        }),
      });
      return this._handleResponceWithBody(res);
    } catch (err) {
      console.error(err);
    }
  };

  register = async ({ email, password }) => {
    try {
      const res = await fetch(`${this._baseUrl}/signup`, {
        method: 'POST',
        ...this._extraOptions,
        headers: this._headers,
        body: JSON.stringify({
          email,
          password,
        }),
      });
      return this._handleResponceWithBody(res);
    } catch (err) {
      console.error(`${err.name} - ${err.message}`);
    }
  };

  authorize = async ({ email, password }) => {
    try {
      const res = await fetch(`${this._baseUrl}/signin`, {
        method: 'POST',
        ...this._extraOptions,
        headers: this._headers,
        body: JSON.stringify({
          email,
          password,
        }),
      });
      return this._handleResponceWithoutBody(res);
    } catch (err) {
      console.error(err);
    }
  };

  unauthorize = async () => {
    try {
      const res = await fetch(`${this._baseUrl}/signout`, {
        method: 'HEAD',
        ...this._extraOptions,
        headers: this._headers,
      });
      return this._handleResponceWithoutBody(res);
    } catch (err) {
      console.error(err);
    }
  };

  checkAuth = async () => {
    try {
      const res = await fetch(`${this._baseUrl}/users/me`, {
        method: 'HEAD',
        ...this._extraOptions,
        headers: this._headers,
      });
      return this._handleResponceWithoutBody(res);
    } catch (err) {
      console.error(err);
    }
  };
}

//Экземпляр Api для осуществления запросов к серверу
export const api = new Api({
  baseUrl: 'http://www.api.ilovemesto.students.nomoreparties.xyz',
  headers: {
    'Content-Type': 'application/json',
  },
  extraOptions: {
    credentials: 'include',
  },
});
