import axios from 'axios';

export default class AuthService {
  login (username, password) {
    return axios.post('/api/login', { username, password }).then(response => response.data);
  }

  logout () {
    return axios.post('/api/logout').then(response => response.data);
  }
}
