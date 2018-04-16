import { Container } from 'inversify';
import getDecorators from 'inversify-inject-decorators';
import { helpers } from 'inversify-vanillajs-helpers';

let container = new Container();
let { lazyInject } = getDecorators(container);
let register = helpers.register(container);
let registerConstantValue = helpers.registerConstantValue(container);

/* istanbul ignore next */
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

/* istanbul ignore next */
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
