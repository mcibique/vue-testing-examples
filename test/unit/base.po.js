export default class BasePageObj {
  constructor (wrapper) {
    if (!wrapper) {
      throw new Error('Cannot create Page object without specifying wrapper.');
    }

    this.wrapper = wrapper;
  }

  get vm () {
    return this.wrapper.vm;
  }

  attributes () {
    return this.wrapper.attributes();
  }

  classes () {
    return this.wrapper.classes();
  }

  destroy () {
    return this.wrapper.destroy();
  }

  exists () {
    return this.wrapper.exists();
  }

  html () {
    return this.wrapper.html();
  }

  setProps (...args) {
    return this.wrapper.setProps(...args);
  }

  text () {
    return this.wrapper.text();
  }

  tid (...args) {
    return this.wrapper.tid(...args);
  }

  tids (...args) {
    return this.wrapper.tids(...args);
  }

  trigger (...args) {
    return this.wrapper.trigger(...args);
  }
}
