<template>
  <div id="app" class="c-app" tid="c-app">
    <header class="c-app__header" tid="c-app__header">
      <router-link to="/logout" v-if="isAuthenticated" tid="c-app__logout-link">Logout</router-link>
    </header>
    <main class="c-app__main" tid="c-app__main">
      <router-view></router-view>
    </main>
    <footer class="c-app__footer" tid="c-app__footer">
      <router-link to="/about" tid="c-app__about-link">About</router-link>
    </footer>
  </div>
</template>

<script>
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import { AuthGetter } from './store';

@Component
export default class App extends Vue {
  @AuthGetter isAuthenticated;
}
</script>

<style>
:root {
  --text-color: #333;
  --active-color: 2, 116, 169;
  --border-color: #ccc;
  --header-footer-background-color: 17, 4, 62;
  --main-background-color: 4, 34, 62;
  --validation-error-color: #c00;
  --form-background-color: rgba(255, 255, 255, 0.95);
  --form-border-color: rgb(var(--main-background-color));
}

*,
*:before,
*:after {
  box-sizing: border-box;
}

html {
  font-size: 10px;
  font-family: Segoe UI, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-color);
  background-color: #fff;
}

body {
  margin: 0;
  padding: 0;
  height: 100vh;
  min-width: 320px;
  font-size: 1.6rem;
  background: radial-gradient(
    ellipse at center,
    rgba(var(--main-background-color), 0.7) 0%,
    rgb(var(--main-background-color)) 100%
  );
}

input {
  border: 1px solid var(--border-color);
  border-radius: 2px;
  padding: 0.9rem;
  line-height: 2rem;
  color: inherit;
  font-size: 1.4rem;
  width: 100%;
}

:focus,
input:focus {
  outline: rgba(var(--active-color), 0.5) auto 0.5rem;
}

label {
  display: block;
  line-height: 2rem;
  font-weight: bolder;
}

label + input {
  margin-top: 0.5rem;
}

p {
  margin: 0;
}

a {
  color: var(--text-color);
}

a:link,
a:visited,
a:hover,
a:active {
  color: rgb(var(--active-color));
  text-decoration: underline;
}

a:hover,
a:active {
  color: rgba(var(--active-color), 0.75);
}

a:focus {
  outline-style: dashed;
  outline-width: 0.1rem;
}

pre {
  white-space: pre-wrap;
  word-break: break-word;
}

.c-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.c-app__header {
  border-bottom: 1px solid rgba(var(--header-footer-background-color), 1);
  background-color: rgba(var(--header-footer-background-color), 0.25);
  padding: 2rem 4rem;
  text-align: right;
  min-height: 6rem;
  line-height: 2rem;
}

.c-app__main {
  flex-grow: 1;
  flex-basis: 100%;
  padding: 2rem;
}

.c-app__footer {
  padding: 2rem 4rem;
  border-top: 1px solid rgba(var(--header-footer-background-color), 1);
  background-color: rgba(var(--header-footer-background-color), 0.25);
}
</style>
