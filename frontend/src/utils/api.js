class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  /**
   * Метод обработки ответа сервера
   *
   * @param  {Object} responce - объект ответа сервера
   */
  async _checkResponceStatus(responce) {
    if (responce.ok) {
      const json = await responce.json();
      return json;
    }
    throw new Error(`Ошибка: ${responce.status} - ${responce.statusText}`);
  }

  /**
   * Метод получения информации о пользователе с сервера
   *
   * @return {Object}
   */
  async getUserInfo() {
    try {
      const responce = await fetch(`${this._baseUrl}/users/me`, {
        method: 'GET',
        headers: this._headers,
      });
      //Дожидаемся ответа. Если функция вернет ошибку, выводим ее.
      const data = await this._checkResponceStatus(responce);
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Метод получения карточек с сервера
   *
   * @return {Object}
   */
  async getInitialCards() {
    try {
      const responce = await fetch(`${this._baseUrl}/cards`, {
        method: 'GET',
        headers: this._headers,
      });
      const data = await this._checkResponceStatus(responce);
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  async getValidInitialData() {
    const initialData = await Promise.all([
      this.getUserInfo(),
      this.getInitialCards(),
    ]);
    return initialData;
  }

  async getAllInitialData() {
    const initialData = await Promise.allSettled([
      this.getUserInfo(),
      this.getInitialCards(),
    ]);
    return initialData;
  }

  async setUserInfo({ name, about }) {
    try {
      const responce = await fetch(`${this._baseUrl}/users/me`, {
        method: 'PATCH',
        headers: this._headers,
        body: JSON.stringify({
          name,
          about,
        }),
      });
      const data = await this._checkResponceStatus(responce);
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  async addCard({ name, link }) {
    try {
      const responce = await fetch(`${this._baseUrl}/cards`, {
        method: 'POST',
        headers: this._headers,
        body: JSON.stringify({
          name,
          link,
        }),
      });
      const data = await this._checkResponceStatus(responce);
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  async deleteCard(cardId) {
    try {
      const responce = await fetch(`${this._baseUrl}/cards/${cardId}`, {
        method: 'DELETE',
        headers: this._headers,
      });
      const data = await this._checkResponceStatus(responce);
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  async changeLikeCardStatus(cardId, methodHTTP) {
    try {
      const responce = await fetch(`${this._baseUrl}/cards/likes/${cardId}`, {
        method: methodHTTP,
        headers: this._headers,
      });
      const data = await this._checkResponceStatus(responce);
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  async updateUserAvatar(avatar) {
    try {
      const responce = await fetch(`${this._baseUrl}/users/me/avatar`, {
        method: 'PATCH',
        headers: this._headers,
        body: JSON.stringify({
          avatar,
        }),
      });
      const data = await this._checkResponceStatus(responce);
      return data;
    } catch (error) {
      console.error(error);
    }
  }
}

//Экземпляр Api для осуществления запросов к серверу
export const api = new Api({
  baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-16',
  headers: {
    authorization: 'f1f27dcb-4c71-4cd5-a34d-2e8f5fd4811e',
    'Content-Type': 'application/json',
  },
});
