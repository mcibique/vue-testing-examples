import sinon from 'sinon';
import { expect } from 'chai';

let originalConsoleError = console.error.bind(console);

beforeEach(function () {
  this.consoleErrorStub = console.error = sinon.stub().callsFake(originalConsoleError);
});

afterEach(function () {
  expect(this.consoleErrorStub).not.to.have.been.called;
});
