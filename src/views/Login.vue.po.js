import BasePageObj from '@unit/base.po';
import MyButtonPageObj from '@/components/MyButton.vue.po';
import MyCheckboxPageObj from '@/components/MyCheckbox.vue.po';

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

  get rememberMeCheckbox () {
    return new MyCheckboxPageObj(this.tid('login__remember-me'));
  }

  get submitButton () {
    return new MyButtonPageObj(this.tid('login__submit-button'));
  }

  get validationError () {
    return this.tid('login__validation-error');
  }

  get helpSection () {
    return this.tid('login__help-section');
  }

  get helpSectionLinks () {
    return this.tids('login__help-section-links');
  }

  submit () {
    this.form.trigger('submit');
  }

  login (username, password, rememberMe = false) {
    this.usernameInput.element.value = username;
    this.usernameInput.trigger('input');

    this.passwordInput.element.value = password;
    this.passwordInput.trigger('input');

    this.rememberMeCheckbox.setChecked(rememberMe);

    this.submit();
  }
}
