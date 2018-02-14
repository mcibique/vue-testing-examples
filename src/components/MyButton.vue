<template functional>
  <button @click="props.click && props.click()" class="c-button" :class="{ 'c-button--primary': !!props.primary }" v-bind="props"><slot></slot></button>
</template>

<style>
  .c-button {
    background: #fff;
    padding: 5px 10px;
    line-height: 20px;
    border: 1px solid #d2d2d2;
    border-radius: 2px;
    cursor: pointer;
  }

  .c-button--primary {
    background: #0274a9;
    color: #efefef;
  }

  .c-button--primary:hover,
  .c-button--primary:active,
  .c-button--primary:focus {
    background: #0274d9;
    color: #efefef;
  }
</style>
