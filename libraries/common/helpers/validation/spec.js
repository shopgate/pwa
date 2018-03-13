import { isNumeric } from './index';

describe('helpers/validation', () => {
  describe('isNumeric', () => {
    describe('Non-regression, "123" is not numeric', () => {
      it('should treat numeric number as numeric', () => {
        expect(isNumeric('123')).toBe(true);
      });
    });
  });
});
