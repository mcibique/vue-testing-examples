<template functional>
  <button :class="[data.staticClass, 'c-button', { 'c-button--primary': !!props.primary }]" v-bind="data.attrs" v-on="listeners"><slot></slot></button>
</template>

<script>
import { Component } from 'vue-property-decorator';

@Component
export default class MyButton {}
</script>

<style>
.c-button {
  background: #fff;
  padding: 0.9rem 2rem;
  line-height: 2rem;
  border: 1px solid #d2d2d2;
  border-radius: 2px;
  cursor: pointer;
  font-weight: bold;
}

.c-button--primary {
  background: rgb(2, 116, 169);
  color: #efefef;
}

.c-button--primary:hover,
.c-button--primary:active,
.c-button--primary:focus {
  background: rgba(2, 116, 169, 0.9);
  color: #efefef;
}
</style>
