import { mount, createLocalVue } from '@vue/test-utils';
import { expect } from 'chai';
import sinon from 'sinon';
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import flushPromises from 'flush-promises';

import LoginView from '@/views/Login.vue';
import LoginViewPageObj from '@/views/Login.vue.po';
import { createStore } from '@/store';
import { createRouter } from '@/router';

describe('Login view', function () {
  beforeEach(function () {
    this.axios = new AxiosMockAdapter(axios);

    this.localVue = createLocalVue();
    this.router = createRouter(this.localVue);
    this.store = createStore(this.localVue);

    this.mountLoginView = function (options) {
      let wrapper = mount(LoginView, { localVue: this.localVue, router: this.router, store: this.store, ...options });
      return new LoginViewPageObj(wrapper);
    };
  });

  afterEach(function () {
    this.axios.verifyNoOutstandingExpectation();
    this.axios.reset();
  });

  it('should render properly', function () {
    let loginView = this.mountLoginView();
    expect(loginView.validationError.exists(), 'Validation error should not be visible').to.be.false;
    expect(loginView.usernameInput.element.value, 'Username should be initialized with empty value').to.equal('');
    expect(loginView.passwordInput.element.value, 'Password should be initialized with empty value').to.equal('');
    expect(loginView.submitButton.attributes().disabled, 'Submit button should be enabled').to.be.undefined;
  });

  describe("when user doesn't enter username", function () {
    it('should display validation error', async function () {
      let fakeReply = sinon.stub().returns([500, {}]);
      this.axios.onAny().reply(fakeReply);

      let loginView = this.mountLoginView();
      loginView.login('', 'password');

      await flushPromises();

      expect(fakeReply, 'No external API should have been called').not.to.have.been.called;
      expect(loginView.validationError.text(), 'Validation error should be displayed with message').to.equal('Please enter your username');

      this.axios.reset(); // reset unused .onAny() handler so the afterEach hook will not fail on verifyNoOutstandingExpectation()
    });
  });

  describe("when user doesn't enter password", function () {
    it('should display validation error', function () {
      let fakeReply = sinon.stub().returns([500, {}]);
      this.axios.onAny().reply(fakeReply);

      let loginView = this.mountLoginView();
      loginView.login('username', '');
      expect(fakeReply, 'No external API should have been called').not.to.have.been.called;
      expect(loginView.validationError.text(), 'Validation error should be displayed with message').to.equal('Please enter your password');

      this.axios.reset(); // reset unused .onAny() handler so the afterEach hook will not fail on verifyNoOutstandingExpectation()
    });
  });

  describe('when user enters username and password', function () {
    describe('and values are valid credentials', function () {
      beforeEach(function () {
        let username = 'test_username';
        let password = 'test_password';
        this.axios.onPost('/api/login', { username, password }).replyOnce(200, 'random_token');

        this.loginView = this.mountLoginView();
        this.loginView.login(username, password);

        return flushPromises();
      });

      it('should not display any error message', function () {
        expect(this.loginView.validationError.exists(), 'Validation error should not be visible').to.be.false;
      });

      it('should take user to the welcome page', function () {
        expect(this.router.currentRoute.name).to.equal('welcome');
      });
    });

    describe('and values are not valid credentials', function () {
      beforeEach(function () {
        let username = 'test_username';
        let password = 'test_password';
        this.expectedErrorMessage = 'Invalid username or password';
        this.axios.onPost('/api/login', { username, password }).replyOnce(401, { error: { message: this.expectedErrorMessage } });

        this.loginView = this.mountLoginView();
        this.loginView.login(username, password);

        return flushPromises();
      });

      it('should show error message', function () {
        expect(this.loginView.validationError.exists(), 'Validation error should be visible').to.be.true;
        expect(this.loginView.validationError.text(), 'Validation error should display error message from API').to.equal(this.expectedErrorMessage);
      });

      it('should reset password input back to initial value', function () {
        expect(this.loginView.passwordInput.element.value, 'Password wasn\'t reset back to initial value').to.equal('');
      });
    });
  });
});
