import '@unit/globals';
import { expect } from 'chai';

import { isAuthenticated } from './getters';

describe('Store - Auth module getters', function () {
  describe('isAuthenticated', function () {
    it('should return true if authentication token exists', function () {
      expect(isAuthenticated({ token: 'random_token' })).to.be.true;
    });

    it('should return false if authentication token doesn\'t exists', function () {
      expect(isAuthenticated({ token: null })).to.be.false;
    });
  });
});
