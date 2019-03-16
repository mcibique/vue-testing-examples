<template>
  <div tid="c-checkbox-list">
    <slot/>
  </div>
</template>
<script>
import Vue from 'vue';
import { Component, Provide } from 'vue-property-decorator';

import MY_CHECKBOX_LIST_CONTEXT from './MyCheckboxListContext';

@Component
export default class MyCheckboxList extends Vue {
  registeredCheckboxes = new Map();

  registerCheckbox (id, value) {
    this.registeredCheckboxes.set(id, value);
    this.checkboxList.numberOfCheckboxes = this.registeredCheckboxes.size;
  }

  removeCheckbox (id) {
    this.registeredCheckboxes.delete(id);
    this.checkboxList.numberOfCheckboxes = this.registeredCheckboxes.size;
  }

  changeValue (id, value) {
    this.registeredCheckboxes.set(id, value);
    this.checkboxList.numberOfSelectedCheckboxes = Array.from(this.registeredCheckboxes.values()).filter(val => !!val).length;
  }

  @Provide(MY_CHECKBOX_LIST_CONTEXT) checkboxList = {
    registerCheckbox: this.registerCheckbox,
    removeCheckbox: this.removeCheckbox,
    changeValue: this.changeValue,
    numberOfCheckboxes: 0,
    numberOfSelectedCheckboxes: 0
  }
}
</script>
<style>
</style>
