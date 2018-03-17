import { expect } from 'chai';

import container from '@di';
import { STORE_ID } from '@/store';
import { authRequestInterceptor } from './auth-interceptor';

describe('Auth interceptor', function () {
  beforeEach(function () {
    container.snapshot();

    this.store = { state: { auth: {} } };
    container.bind(STORE_ID).toConstantValue(this.store);
  });

  afterEach(function () {
    container.restore();
  });

  describe('when user is already authenticated', function () {
    beforeEach(function () {
      this.authToken = 'random_token';
      this.store.state.auth.token = this.authToken;
    });

    it('should attach credentials to each request', function () {
      let config = { headers: {} };
      let modifiedConfig = authRequestInterceptor(config);
      expect(modifiedConfig.headers.Authorization).to.equal(`Bearer ${this.authToken}`);
    });
  });

  describe('when user is not authenticated', function () {
    beforeEach(function () {
      this.store.state.auth.token = null;
    });

    it('should return original config object', function () {
      let config = { headers: {} };
      let modifiedConfig = authRequestInterceptor(config);
      expect(modifiedConfig).to.deep.equal(config);
    });

    it('should not create Authorization header', function () {
      let config = { headers: {} };
      let modifiedConfig = authRequestInterceptor(config);
      expect(modifiedConfig.headers.Authorization).to.be.undefined;
    });
  });
});
