import { describeValue, toError } from './error';

describe('error helpers', () => {
  describe('describeValue()', () => {
    it('should return primitives and errors as text', () => {
      expect(describeValue('text')).toBe('text');
      expect(describeValue(42)).toBe('42');
      expect(describeValue(null)).toBe('null');
      expect(describeValue(undefined)).toBe('undefined');
      expect(describeValue(new Error('boom'))).toBe('Error: boom');
    });

    it('should describe objects by their keys and error code without their values', () => {
      expect(describeValue({ mail: 'jane@example.com' })).toBe('{keys: mail}');
      expect(describeValue({
        code: 'EINVALID',
        message: 'jane@example.com is not valid',
      })).toBe('{code: "EINVALID", keys: code, message}');
    });

    it('should describe the entries of an array', () => {
      expect(describeValue([{ mail: 'jane@example.com' }, 'text'])).toBe('[{keys: mail}, text]');
    });
  });

  describe('toError()', () => {
    it('should return an error as it is', () => {
      const error = new Error('boom');

      expect(toError(error)).toBe(error);
    });

    it.each([
      ['a string', 'Something failed', 'Something failed'],
      ['null', null, 'null'],
      ['undefined', undefined, 'undefined'],
      ['an object', { code: 'ECUSTOM', mail: 'jane@example.com' }, '{code: "ECUSTOM", keys: code, mail}'],
      ['a frozen error', Object.freeze(new Error('Frozen')), 'Error: Frozen'],
    ])('should turn %s into an error with the given properties', (name, thrown, message) => {
      const error = toError(thrown, { context: 'test' });

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(message);
      expect(error.context).toBe('test');
    });

    it('should add the properties to an error as it is', () => {
      const thrown = new Error('boom');

      const error = toError(thrown, { context: 'test' });

      expect(error).toBe(thrown);
      expect(error.context).toBe('test');
    });

    it('should replace a property the error only has a getter for', () => {
      /**
       * An error like a DOMException, whose code can't be assigned.
       */
      class ReadOnlyCodeError extends Error {
        /**
         * @returns {number}
         */
        get code() { // eslint-disable-line class-methods-use-this
          return 18;
        }
      }
      const thrown = new ReadOnlyCodeError('Not allowed');

      const error = toError(thrown, { code: 'ETRACKING' });

      expect(error).toBe(thrown);
      expect(error.code).toBe('ETRACKING');
    });

    it('should describe an error whose property can not be redefined', () => {
      const thrown = new Error('Not allowed');
      Object.defineProperty(thrown, 'code', { value: 18 });

      const error = toError(thrown, { code: 'ETRACKING' });

      expect(error).not.toBe(thrown);
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Error: Not allowed');
      expect(error.code).toBe('ETRACKING');
    });

    it('should return an error without properties to add as it is, even when it is frozen', () => {
      const thrown = Object.freeze(new Error('Frozen'));

      expect(toError(thrown)).toBe(thrown);
    });
  });
});
