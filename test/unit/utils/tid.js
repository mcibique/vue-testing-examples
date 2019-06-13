import { Wrapper, WrapperArray } from '@vue/test-utils';

Wrapper.prototype.tid = function (selector) {
  return this.find(`[tid~="${selector}"]`);
};

Wrapper.prototype.tids = WrapperArray.prototype = function (selector) {
  return this.findAll(`[tid~="${selector}"]`);
};
