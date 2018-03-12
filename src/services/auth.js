import axios from 'axios';
import { Register } from '@di';

export const AUTH_SERVICE_ID = Symbol('authService');

@Register(AUTH_SERVICE_ID)
export default class AuthService {
  login (username, password) {
    return axios.post('/api/login', { username, password }).then(response => response.data);
  }

  logout () {
    return axios.post('/api/logout').then(response => response.data);
  }
}
