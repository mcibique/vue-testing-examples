import { mount } from '@vue/test-utils';

let NoopComponent = {
  name: 'noop',
  render () {
    return null;
  }
};

let dummyComponent = mount(NoopComponent);
let VueWrapperPrototype = Object.getPrototypeOf(dummyComponent);
let WrapperPrototype = Object.getPrototypeOf(VueWrapperPrototype);

WrapperPrototype.tid = function (selector) {
  return this.find(`[tid~="${selector}"]`);
};

WrapperPrototype.tids = function (selector) {
  return this.findAll(`[tid~="${selector}"]`);
};
