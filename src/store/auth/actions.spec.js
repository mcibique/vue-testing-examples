import '@unit/globals';
import { expect } from 'chai';
import sinon from 'sinon';

import { mockService } from '@unit/utils/di';
import { AUTH_SERVICE_ID } from '@/services/auth';
import { login, logout } from './actions';

describe('Store - Auth module actions', function () {
  beforeEach(function () {
    this.authServiceMock = mockService(AUTH_SERVICE_ID);

    this.commitStub = sinon.stub();
    this.dispatchStub = sinon.stub();
    this.actionContext = {
      commit: this.commitStub,
      dispatch: this.dispatchStub
    };
  });

  afterEach(function () {
    this.authServiceMock.verify();
    this.authServiceMock.restore();
  });

  describe('login', function () {
    beforeEach(function () {
      this.loginApiMock = this.authServiceMock.expects('login').returnsPromise().once();
    });

    it('should verify login credentials using external service', function () {
      let username = 'random_username';
      let password = 'random_password';
      login(this.actionContext, { username, password });
      expect(this.loginApiMock).to.have.been.calledWith(username, password);
    });

    describe('when given credentials are valid', function () {
      beforeEach(function () {
        this.authToken = 'random_token';
        this.loginApiMock.resolves(this.authToken);
      });

      it('should set token into the store', async function () {
        let username = 'random_username';
        let password = 'random_password';
        let result = await login(this.actionContext, { username, password });
        expect(result).to.equal(this.authToken);
        expect(this.commitStub).to.have.been.calledWith('setToken', this.authToken);
      });
    });

    describe('when given credentials are not valid', function () {
      beforeEach(function () {
        this.loginApiMock.rejects({});
      });

      it('should not update token in the store', async function () {
        let username = 'random_username';
        let password = 'random_password';
        let errorHandler = sinon.spy();

        await login(this.actionContext, { username, password }).catch(errorHandler);

        expect(errorHandler, 'Should propagate the error to the next callback').to.have.been.called;
        expect(this.dispatchStub, 'Should not perform any action in the store').not.to.have.been.called;
        expect(this.commitStub, 'Should not perform any action in the store').not.to.have.been.called;
      });
    });
  });

  describe('logout', function () {
    beforeEach(function () {
      this.logoutApiMock = this.authServiceMock.expects('logout').returnsPromise().once();
    });

    it('should notify external service', function () {
      logout(this.actionContext);
      expect(this.logoutApiMock).to.have.been.called;
    });

    describe('when external service clean up has finished', function () {
      beforeEach(function () {
        this.logoutApiMock.resolves();
      });

      it('should perform the user session clean up in the store', async function () {
        await logout(this.actionContext);
        expect(this.commitStub).to.have.been.calledWith('resetToken');
      });
    });

    describe('when external service clean up has failed', function () {
      beforeEach(function () {
        this.logoutApiMock.rejects();
      });

      it('should still perform the user session clean up in the store', async function () {
        await logout(this.actionContext);
        expect(this.commitStub).to.have.been.calledWith('resetToken');
      });
    });
  });
});
