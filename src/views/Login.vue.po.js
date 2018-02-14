export default class LoginViewPageObj {
  constructor (element) {
    this.element = element;
  }

  get form () {
    return this.element.tid('login__form');
  }

  get usernameInput () {
    return this.element.tid('login__username');
  }

  get passwordInput () {
    return this.element.tid('login__password');
  }

  get submitButton () {
    return this.element.tid('login__submit-button');
  }

  get validationError () {
    return this.element.tid('login__validation-error');
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
