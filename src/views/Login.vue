<template>
  <form autocomplete="off" novalidate @submit.prevent="onLoginSubmit()" tid="login__form">
    <p v-if="this.validationError" tid="login__validation-error">{{ this.validationError }}</p>

    <label for="username">Username:</label>
    <input type="text" id="username" name="username" placeholder="Enter your username" v-model="username" tid="login__username">

    <label for="password">Password:</label>
    <input type="password" id="password" name="password" placeholder="Enter your password" v-model="password" tid="login__password">

    <my-button type="submit" tid="login__submit-button" :primary="true">Log in</my-button>
  </form>
</template>

<script>
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import MyButton from '@/components/MyButton';

@Component({
  components: { MyButton }
})
export default class LoginView extends Vue {
    password = '';
    username = '';
    validationError = null;

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
          this.validationError = response.data.error.message;
        });
    }

    login (username, password) {
      return this.$store.dispatch('auth/login', { username, password });
    }
}

</script>
