import { expect } from 'chai';
import { fullName } from './full-name';

describe('fullName filter', function () {
  describe('when no profile is provided', function () {
    it('should return empty string', function () {
      expect(fullName()).to.equal('');
    });
  });

  describe('when only first name is provided', function () {
    it('should return only first name', function () {
      expect(fullName({ firstName: 'random_first_name' })).to.equal('random_first_name');
    });
  });

  describe('when only last name is provided', function () {
    it('should return only last name', function () {
      expect(fullName({ lastName: 'random_last_name' })).to.equal('random_last_name');
    });
  });

  describe('when first and last name are provided', function () {
    it('should return both', function () {
      expect(fullName({ firstName: 'random_first_name', lastName: 'random_last_name' })).to.equal('random_first_name random_last_name');
    });

    describe('and username is also provided', function () {
      it('should ignore username and only use first name and last name', function () {
        expect(fullName({ firstName: 'random_first_name', lastName: 'random_last_name', username: 'random_username' })).to.equal('random_first_name random_last_name');
      });
    });
  });

  describe('when only user name is provided', function () {
    it('should return only user name', function () {
      expect(fullName({ username: 'random_username' })).to.equal('random_username');
    });
  });
});
