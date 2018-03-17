import { Container } from 'inversify';
import getDecorators from 'inversify-inject-decorators';
import { helpers } from 'inversify-vanillajs-helpers';

let container = new Container();
let { lazyInject: LazyInject } = getDecorators(container);
let Register = helpers.register(container);
let RegisterConstantValue = helpers.registerConstantValue(container);

let Override = function (identifier, dependencies, constraint) {
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
  LazyInject,
  Register,
  RegisterConstantValue,
  Override
};

export default container;
