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

      <my-button type="submit" class="c-login__submit-button" tid="login__submit-button" :primary="true">Log in</my-button>
    </form>
  </section>
</template>

<script>
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import MyButton from '@/components/MyButton';
import Focus from '@/directives/focus';

@Component({
  components: { MyButton },
  directives: { Focus }
})
export default class LoginView extends Vue {
  password = '';
  username = '';
  validationError = null;

  login (username, password) {
    return this.$store.dispatch('auth/login', { username, password });
  }

  beforeRouteEnter (to, from, next) {
    next(function (vm) {
      vm.$store.commit('auth/resetToken');
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

    this.login(this.username, this.password)
      .then(() => {
        this.$router.push({ name: 'welcome' });
      })
      .catch(({ response }) => {
        this.password = '';
        this.validationError = response.data.error.message;
      });
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
</style>
