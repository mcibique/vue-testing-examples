export default {
  inserted (el, binding) {
    if (typeof binding.value === 'undefined' || !!binding.value) {
      el.focus();
    }
  },
  componentUpdated (el, binding) {
    if (binding.value !== binding.oldValue) {
      if (typeof binding.value === 'undefined' || !!binding.value) {
        el.focus();
      } else {
        el.blur();
      }
    }
  }
};
