class Auth {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _checkResponceStatus = async (res) => {
    return res.ok ? res.json() : { error: `${res.status} - ${res.statusText}` };
  };

  register = async ({ password, email }) => {
    try {
      const res = await fetch(`${this._baseUrl}/signup`, {
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

  checkToken = async ({ token }) => {
    try {
      const res = await fetch(`${this._baseUrl}/users/me`, {
        method: 'GET',
        headers: {
          ...this._headers,
          Authorization: `Bearer ${token}`,
        },
      });
      return this._checkResponceStatus(res);
    } catch (err) {
      console.error(`${err.name} - ${err.message}`);
    }
  };
}

const auth = new Auth({
  baseUrl: 'https://auth.nomoreparties.co',
  headers: {
    'Content-Type': 'application/json',
  },
});

export { auth };
