import '@unit/globals';
import { expect } from 'chai';
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

import { mockService } from '@unit/utils/di';
import container from '@di';
import { AUTH_SERVICE_ID } from './auth';
import { CREDENTIALS_SERVICE_ID } from './credentials';

describe('Auth service', function () {
  beforeEach(function () {
    this.credentialsServiceMock = mockService(CREDENTIALS_SERVICE_ID);

    this.authService = container.get(AUTH_SERVICE_ID);
    this.axios = new AxiosMockAdapter(axios);
  });

  afterEach(function () {
    this.credentialsServiceMock.verify();
    this.credentialsServiceMock.restore();

    this.axios.verifyNoOutstandingExpectation();
    this.axios.restore();
  });

  it('should exists', function () {
    expect(this.authService).to.be.ok;
  });

  describe('login()', function () {
    beforeEach(function () {
      this.credentialsServiceMock.expects('sanitize').callsFake(x => x).twice();
    });

    it('should call external API with given params', async function () {
      let fakeData = {};
      let username = 'fake_username';
      let password = 'fake_password';
      this.axios.onPost('/api/login', { username, password }).replyOnce(200, fakeData);

      let response = await this.authService.login(username, password);
      expect(response).to.deep.equal(fakeData);
    });
  });

  describe('logout()', function () {
    it('should call external API', async function () {
      let fakeData = {};
      this.axios.onPost('/api/logout').replyOnce(200, fakeData);

      let response = await this.authService.logout();
      expect(response).to.deep.equal(fakeData);
    });
  });
});
