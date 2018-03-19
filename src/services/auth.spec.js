import '@unit/globals';
import { expect } from 'chai';
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

import container from '@di';
import { AUTH_SERVICE_ID } from './auth';

describe('Auth service', function () {
  beforeEach(function () {
    this.authService = container.get(AUTH_SERVICE_ID);
    this.axios = new AxiosMockAdapter(axios);
  });

  afterEach(function () {
    this.axios.verifyNoOutstandingExpectation();
    this.axios.restore();
  });

  it('should exists', function () {
    expect(this.authService).to.be.ok;
  });

  describe('login()', function () {
    it('should call external API with given params', function () {
      let fakeData = {};
      let username = 'fake_username';
      let password = 'fake_password';
      this.axios.onPost('/api/login', { username, password }).replyOnce(200, fakeData);
      return this.authService.login(username, password).then(function (response) {
        expect(response).to.deep.equal(fakeData);
      });
    });
  });

  describe('logout()', function () {
    it('should call external API', function () {
      let fakeData = {};
      this.axios.onPost('/api/logout').replyOnce(200, fakeData);
      return this.authService.logout().then(function (response) {
        expect(response).to.deep.equal(fakeData);
      });
    });
  });
});
