import { Container } from 'inversify';
import getDecorators from 'inversify-inject-decorators';
import { helpers } from 'inversify-vanillajs-helpers';

let container = new Container();
let { lazyInject } = getDecorators(container);
let register = helpers.register(container);
let registerConstantValue = helpers.registerConstantValue(container);

function override (identifier, dependencies, constraint) {
  return function (constructor) {
    helpers.annotate(constructor, dependencies);
    if (container.isBound(identifier)) {
      container.unbind(identifier);
    }
    let binding = container.bind(identifier).to(constructor);
    if (constraint) {
      constraint(binding);
    }
  };
};

function overrideWithConstantValue (identifier, newConstantValue) {
  if (container.isBound(identifier)) {
    container.unbind(identifier);
  }

  return registerConstantValue(identifier, newConstantValue);
}

export {
  lazyInject,
  lazyInject as LazyInject,
  register,
  register as Register,
  registerConstantValue,
  registerConstantValue as RegisterConstantValue,
  override,
  override as Override,
  overrideWithConstantValue
};

export default container;

// global registrations
export const GLOBAL_ID = Symbol('global');
container.bind(GLOBAL_ID).toConstantValue(global);

export const TIMEOUT_ID = Symbol('timeout');
container.bind(TIMEOUT_ID).toDynamicValue(function ({ container }) {
  let global = container.get(GLOBAL_ID);
  let timeout = global.setTimeout.bind(global);
  timeout.cancel = global.clearTimeout.bind(global);
  return timeout;
}).inSingletonScope();

export const DOCUMENT_ID = Symbol('document');
container.bind(DOCUMENT_ID).toDynamicValue(function ({ container }) {
  let global = container.get(GLOBAL_ID);
  return global.document;
}).inSingletonScope();

export class VueDI {
  static install (Vue) {
    Object.defineProperty(Vue.prototype, '$global', {
      get () {
        return container.get(GLOBAL_ID);
      }
    });

    Object.defineProperty(Vue.prototype, '$timeout', {
      get () {
        return container.get(TIMEOUT_ID);
      }
    });

    Object.defineProperty(Vue.prototype, '$document', {
      get () {
        return container.get(DOCUMENT_ID);
      }
    });
  }
}

if (process.env.NODE_ENV === 'test') {
  function init() {
    container.rebind(TIMEOUT_ID).toDynamicValue(function ({ container }) {
      let globalMock = {};
      let clock = require('lolex').install({ target: globalMock, toFake: ['setTimeout', 'clearTimeout'] });

      let timeout = clock.setTimeout.bind(clock);
      let cancel = clock.clearTimeout.bind(clock);

      Object.setPrototypeOf(timeout, clock);
      timeout.cancel = cancel;
      timeout.restore = function () {
        init();
      }
      return timeout;

    }).inSingletonScope();
  }

  init();
}