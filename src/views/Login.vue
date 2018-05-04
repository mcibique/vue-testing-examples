<template>
  <section class="c-login">
    <form autocomplete="off" novalidate class="c-login__form" @submit.prevent="onLoginSubmit()" tid="login__form">
      <h1 class="c-login__header">Login</h1>
      <p v-if="this.validationError" class="c-login__validation_error" tid="login__validation-error">{{ this.validationError }}</p>

      <div class="c-login__row">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" placeholder="Enter your username" v-model="username" v-focus tid="login__username">
      </div>
      <div class="c-login__row">
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" placeholder="Enter your password" v-model="password" tid="login__password">
      </div>
      <div class="c-login__row">
        <my-checkbox v-model="rememberMe" tid="login__remember-me">Remember me</my-checkbox>
      </div>

      <my-button type="submit" class="c-login__submit-button" tid="login__submit-button" :primary="true">Log in</my-button>
      <div class="c-login__help-section" tid="login__help-section" v-if="displayHelp">
        <a class="c-login__help-section-link" href="#" tid="login__help-section-link">Need help?</a>
        <a class="c-login__help-section-link" href="#" tid="login__help-section-link">Forgot your password?</a>
      </div>
    </form>
  </section>
</template>

<script>
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import { LazyInject, GLOBAL_ID } from '@di';
import { AuthAction, AuthMutation } from '@/store';
import MyButton from '@/components/MyButton';
import MyCheckbox from '@/components/MyCheckbox';
import Focus from '@/directives/focus';

@Component({
  components: { MyButton, MyCheckbox },
  directives: { Focus }
})
export default class LoginView extends Vue {
  password = '';
  username = '';
  rememberMe = false;
  validationError = null;
  displayHelp = false;

  @AuthAction('login') login;
  @AuthMutation('resetToken') resetToken;

  @LazyInject(GLOBAL_ID) global;

  beforeRouteEnter (to, from, next) {
    next(function (vm) {
      vm.resetToken();
    });
  }

  onLoginSubmit () {
    this.validationError = '';

    if (!this.username) {
      this.validationError = 'Please enter your username';
      return;
    }

    if (!this.password) {
      this.validationError = 'Please enter your password';
      return;
    }

    this.login({ username: this.username, password: this.password, rememberMe: this.rememberMe })
      .then(() => {
        this.$router.push({ name: 'welcome' });
      })
      .catch(({ response }) => {
        this.password = '';
        this.validationError = response.data.error.message;
      });
  }

  created () {
    this.displayHelpTimeout = this.global.setTimeout(() => {
      this.displayHelp = true;
    }, 5000);
  }

  destroyed () {
    this.global.clearTimeout(this.displayHelpTimeout);
  }
}
</script>

<style>
.c-login {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
}

.c-login__header {
  font-size: 3.2rem;
  line-height: 4rem;
  margin: 0;
  margin-bottom: 2rem;
  text-align: center;
}

.c-login__validation_error {
  color: #c00;
  padding: 1rem 0;
}

.c-login__form {
  max-width: 400px;
  width: 100%;
  border: 1px solid #eee;
  padding: 4rem;
}

.c-login__row + .c-login__row {
  margin-top: 2rem;
}

.c-login__submit-button {
  margin-top: 2rem;
}

.c-login__help-section {
  margin-top: 2rem;
  line-height: 2.5rem;
}

.c-login__help-section-link:after {
  content: "";
  display: block;
}
</style>
