import sinon from 'sinon';
import container, { overrideWithConstantValue } from '@di';

export function mockService (identifier) {
  let service = container.get(identifier);
  let serviceMock = sinon.mock(service);
  overrideWithConstantValue(identifier, service);
  return serviceMock;
}
