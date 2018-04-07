import '@unit/globals';
import { expect } from 'chai';

import container from '@di';
import { CREDENTIALS_SERVICE_ID } from './credentials';

describe('Credentials service', function () {
  beforeEach(function () {
    this.credentialsService = container.get(CREDENTIALS_SERVICE_ID);
  });

  it('should exists', function () {
    expect(this.credentialsService).to.be.ok;
  });

  describe('sanitize()', function () {
    [
      [null, null],
      [{}, {}],
      ['', ''],
      ['abc', 'abc'],
      [' abc', 'abc'],
      ['abc ', 'abc'],
      [' abc ', 'abc'],
      ['\nabc\t', 'abc']
    ].forEach(function ([input, expectedOutput]) {
      describe(`when input is ${JSON.stringify(input)}`, function () {
        it(`should return ${JSON.stringify(expectedOutput)}`, function () {
          let output = this.credentialsService.sanitize(input);
          expect(output).to.deep.equal(expectedOutput);
        });
      });
    });
  });
});
