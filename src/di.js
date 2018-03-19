import { Container } from 'inversify';
import getDecorators from 'inversify-inject-decorators';
import { helpers } from 'inversify-vanillajs-helpers';

let container = new Container();
let { lazyInject } = getDecorators(container);
let register = helpers.register(container);
let registerConstantValue = helpers.registerConstantValue(container);

let override = function (identifier, dependencies, constraint) {
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

export {
  lazyInject,
  lazyInject as LazyInject,
  register,
  register as Register,
  registerConstantValue,
  registerConstantValue as RegisterConstantValue,
  override,
  override as Override
};

export default container;
