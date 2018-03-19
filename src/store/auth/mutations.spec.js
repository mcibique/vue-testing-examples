import '@unit/globals';
import { expect } from 'chai';

import { resetToken, setToken } from './mutations';

describe('Store - Auth module mutations', function () {
  describe('resetToken', function () {
    it('should reset token in the store', function () {
      let currentState = { token: 'random_token' };
      resetToken(currentState);
      expect(currentState).to.deep.equal({ token: null });
    });
  });

  describe('setToken', function () {
    it('should set new token into the store', function () {
      let currentState = { token: null };
      let newToken = 'random_token';
      setToken(currentState, newToken);
      expect(currentState).to.deep.equal({ token: newToken });
    });

    it('should override any existing token in the store', function () {
      let currentState = { token: 'previous_random_token' };
      let newToken = 'random_token';
      setToken(currentState, newToken);
      expect(currentState).to.deep.equal({ token: newToken });
    });
  });
});
