import { createLocalVue } from '@vue/test-utils';
import { expect } from 'chai';
import sinon from 'sinon';
import flushPromises from 'flush-promises';

import { createRouter } from '@/router';

describe('Router', function () {
  beforeEach(function () {
    this.localVue = createLocalVue();

    this.store = {
      state: {},
      dispatch: sinon.stub().returnsPromise()
    };

    this.router = createRouter(this.localVue, this.store);
  });

  it('should exist', function () {
    expect(this.router).to.be.ok;
  });

  describe('logout route', function () {
    describe('when entering the route', function () {
      beforeEach(function () {
        this.router.push({ name: 'logout' });
        return flushPromises();
      });

      it('should always clean up current user session', function () {
        expect(this.store.dispatch).to.have.been.calledWith('auth/logout');
      });

      describe('and the user session has been cleaned up successfully', function () {
        beforeEach(function () {
          this.store.dispatch.resolves();
          return flushPromises();
        });

        it('should continue to the login view', function () {
          expect(this.router.currentRoute.name).to.equal('login');
        });
      });

      describe('and the session clean up failed', function () {
        beforeEach(function () {
          this.store.dispatch.rejects();
          return flushPromises();
        });

        it('should still continue to the login view', function () {
          expect(this.router.currentRoute.name).to.equal('login');
        });
      });
    });
  });

  describe('root route', function () {
    describe('when user is not logged in', function () {
      beforeEach(function () {
        this.store.state.auth = { token: 'random_token' };
      });

      it('should redirect user to welcome view', async function () {
        this.router.push({ name: 'root' });
        await flushPromises();
        expect(this.router.currentRoute.name).to.equal('welcome');
      });
    });

    describe('when user is already logged in', function () {
      beforeEach(function () {
        this.store.state.auth = { token: null };
      });

      it('should redirect user to login view', async function () {
        this.router.push({ name: 'root' });
        await flushPromises();
        expect(this.router.currentRoute.name).to.equal('login');
      });
    });
  });

  describe('auth navigation guard', function () {
    beforeEach(function () {
      this.store.state.auth = { token: null };
      this.router.addRoutes([
        { name: 'protected-route', path: '/protected-route', meta: { requiresAuth: true } },
        { name: 'unprotected-route', path: '/unprotected-route', meta: { requiresAuth: false } }
      ]);
    });

    describe('when user navigates to route which requires authentication', function () {
      describe('and user is not authenticated', function () {
        beforeEach(function () {
          this.store.state.auth.token = null;
          this.router.push('protected-route');
          return flushPromises();
        });

        it('should redirect user back to login', function () {
          expect(this.router.currentRoute.name).to.equal('login');
        });
      });

      describe('and user has already been authenticated', function () {
        beforeEach(function () {
          this.store.state.auth.token = 'auth_token';
          this.router.push('protected-route');
          return flushPromises();
        });

        it('should allow the navigation to the route', function () {
          expect(this.router.currentRoute.name).to.equal('protected-route');
        });
      });
    });

    describe('when user navigates to route which doesn\'t require any authentication', function () {
      beforeEach(function () {
        this.router.push('unprotected-route');
        return flushPromises();
      });
      it('should allow the navigation to the route', function () {
        expect(this.router.currentRoute.name).to.equal('unprotected-route');
      });
    });
  });
});
