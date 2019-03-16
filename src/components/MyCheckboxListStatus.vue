<template>
  <div class="c-checkbox-list-status" v-if="hasCheckboxes" tid="c-checkbox-list-status">
    <slot
      :numberOfCheckboxes="checkboxList.numberOfCheckboxes"
      :numberOfSelectedCheckboxes="checkboxList.numberOfSelectedCheckboxes"
    >
      <span tid="c-checkbox-list-status__default-message">{{ defaultStatusMessage }}</span>
    </slot>
  </div>
</template>
<script>
import Vue from 'vue';
import { Component, Inject } from 'vue-property-decorator';

import MY_CHECKBOX_LIST_CONTEXT from './MyCheckboxListContext';

@Component
export default class MyCheckboxListStatus extends Vue {
  @Inject({ from: MY_CHECKBOX_LIST_CONTEXT }) checkboxList;

  get hasCheckboxes () {
    return this.checkboxList.numberOfCheckboxes > 0;
  }

  get defaultStatusMessage () {
    return `You selected ${this.checkboxList.numberOfSelectedCheckboxes} item(s).`;
  }
}
</script>
