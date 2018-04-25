import axios from 'axios';
import { Register } from '@di';

import { CREDENTIALS_SERVICE_ID } from './credentials';

export const AUTH_SERVICE_ID = Symbol('authService');

@Register(AUTH_SERVICE_ID, [CREDENTIALS_SERVICE_ID])
export default class AuthService {
  constructor (credentialsService) {
    this.credentialsService = credentialsService;
  }

  login (username, password, rememberMe) {
    username = this.credentialsService.sanitize(username);
    password = this.credentialsService.sanitize(password);
    return axios.post('/api/login', { username, password, rememberMe }).then(response => response.data);
  }

  logout () {
    return axios.post('/api/logout').then(response => response.data);
  }
}
