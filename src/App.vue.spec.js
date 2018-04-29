import '@unit/globals';
import { mount, createLocalVue } from '@vue/test-utils';
import { expect } from 'chai';
import sinon from 'sinon';

import container from '@di';
import { createStore, STORE_ID } from '@/store';
import { createRouter, ROUTER_ID } from '@/router';
import App from './App';
import AppPageObj from './App.vue.po';

describe('App', function () {
  beforeEach(function () {
    this.localVue = createLocalVue();

    this.store = createStore(this.localVue);
    container.bind(STORE_ID).toConstantValue(this.store);

    this.router = createRouter(this.localVue);
    container.bind(ROUTER_ID).toConstantValue(this.router);

    this.mountApp = function (options) {
      let wrapper = mount(App, {
        localVue: this.localVue,
        store: this.store,
        router: this.router,
        ...options
      });
      return new AppPageObj(wrapper);
    };
  });

  afterEach(function () {
    this.store.restore();
  });

  it('should mount without any errors', function () {
    this.mountApp();
    expect(console.error).not.to.have.been.called;
  });

  it('should render properly', function () {
    let app = this.mountApp();
    expect(app.header.exists(), 'Should render app header').to.be.true;
    expect(app.main.exists(), 'Should render app main content').to.be.true;
    expect(app.footer.exists(), 'Should render app footer').to.be.true;
  });

  it('should always display the About link', function () {
    let app = this.mountApp();
    expect(app.aboutLink.exists(), 'Should render the about link').to.be.true;
  });

  describe('when user is not authenticated', function () {
    beforeEach(function () {
      let isAuthenticatedStub = sinon.stub().returns(false);
      this.store.mockGetter('auth/isAuthenticated', isAuthenticatedStub);
      this.app = this.mountApp();
    });

    it('should not display logout link', function () {
      expect(this.app.logoutLink.exists(), 'Should not display logout link to non-authenticated user').to.be.false;
    });
  });

  describe('when user is authenticated', function () {
    beforeEach(function () {
      let isAuthenticatedStub = sinon.stub().returns(true);
      this.store.mockGetter('auth/isAuthenticated', isAuthenticatedStub);
      this.app = this.mountApp();
    });

    it('should display logout link', function () {
      expect(this.app.logoutLink.exists(), 'Should display logout link to authenticated user').to.be.true;
    });
  });
});
