import sinon from 'sinon';
import { expect } from 'chai';

beforeEach(function () {
  if (console.error.restore) {
    console.error.restore();
  }
  if (console.error.reset) {
    console.error.reset();
  }
  sinon.spy(console, 'error');
});

afterEach(function () {
  expect(console.error, `console.error() has been called ${console.error.callCount} times.`).not.to.have.been.called;
  console.error.restore();
});
