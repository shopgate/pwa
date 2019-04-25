import {
  isBefore,
  isAfter,
  isBetween,
} from './';

describe('helpers/date', () => {
  const date10Hours = new Date('2019-01-01T10:00:00.000Z');
  const date12Hours = new Date('2019-01-01T12:00:00.000Z');
  describe('isBefore', () => {
    it('should be before', () => {
      expect(isBefore(new Date('2019-01-01T09:59:59.000Z'), date10Hours)).toBeTruthy();
    });
    it('should be not before', () => {
      expect(isBefore(new Date('2019-01-01T10:00:00.000Z'), date10Hours)).toBeFalsy();
    });
  });

  describe('isAfter', () => {
    it('should be after', () => {
      expect(isAfter(new Date('2019-01-01T10:00:01.000Z'), date10Hours)).toBeTruthy();
    });
    it('should be not after', () => {
      expect(isAfter(new Date('2019-01-01T10:00:00.000Z'), date10Hours)).toBeFalsy();
    });
  });

  describe('isBetween', () => {
    it('should be between', () => {
      expect(isBetween(new Date('2019-01-01T11:00:00.000Z'), date10Hours, date12Hours)).toBeTruthy();
    });
    it('should be not between', () => {
      expect(isBetween(new Date('2019-01-01T09:00:00.000Z'), date10Hours, date12Hours)).toBeFalsy();
      expect(isBetween(new Date('2019-01-01T13:00:00.000Z'), date10Hours, date12Hours)).toBeFalsy();
    });
    it('should be inclusively between', () => {
      expect(isBetween(new Date('2019-01-01T10:00:00.000Z'), date10Hours, date12Hours)).toBeTruthy();
      expect(isBetween(new Date('2019-01-01T12:00:00.000Z'), date10Hours, date12Hours)).toBeTruthy();
    });
  });
});
