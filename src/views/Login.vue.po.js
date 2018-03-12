import BasePageObj from '@unit/base.po';
import MyButtonPageObj from '@/components/MyButton.vue.po';

export default class LoginViewPageObj extends BasePageObj {
  get form () {
    return this.tid('login__form');
  }

  get usernameInput () {
    return this.tid('login__username');
  }

  get passwordInput () {
    return this.tid('login__password');
  }

  get submitButton () {
    return new MyButtonPageObj(this.tid('login__submit-button'));
  }

  get validationError () {
    return this.tid('login__validation-error');
  }

  submit () {
    this.form.trigger('submit');
  }

  login (username, password) {
    this.usernameInput.element.value = username;
    this.usernameInput.trigger('input');

    this.passwordInput.element.value = password;
    this.passwordInput.trigger('input');

    this.submit();
  }
}
