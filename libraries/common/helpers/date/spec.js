import {
  isBefore,
  isAfter,
  isBetween,
  parseDuration,
  addDuration,
} from '.';

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

  describe('parseDuration', () => {
    const parsed = {
      Year: undefined,
      Month: undefined,
      Week: undefined,
      Day: undefined,
      Hour: undefined,
      Minute: undefined,
      Second: undefined,
    };

    it('should parse 10 second', () => {
      expect(parseDuration('PT10S')).toEqual({
        ...parsed,
        Second: 10,
      });
    });
    it('should parse 1 hour', () => {
      expect(parseDuration('PT1H')).toEqual({
        ...parsed,
        Hour: 1,
      });
    });
    it('should parse 5 day', () => {
      expect(parseDuration('P5D')).toEqual({
        ...parsed,
        Day: 5,
      });
    });
    it('should parse -5 day', () => {
      expect(parseDuration('-P5D')).toEqual({
        ...parsed,
        Day: -5,
      });
    });
  });

  describe('addDuration', () => {
    const dateStub = '2019-01-01T11:00:00.000Z';
    let date;
    beforeEach(() => {
      date = new Date(dateStub);
    });

    it('should add 0sec', () => {
      addDuration(date, 'PT0S');
      expect(date).toEqual(date);
    });
    it('should add 1 hour', () => {
      addDuration(date, 'PT1H');
      expect(date).toEqual(new Date('2019-01-01T12:00:00.000Z'));
    });
    it('should add 5 day', () => {
      addDuration(date, 'P5D');
      expect(date).toEqual(new Date('2019-01-06T11:00:00.000Z'));
    });
    it('should subtract 5 day', () => {
      addDuration(date, '-P5D');
      expect(date).toEqual(new Date('2018-12-27T11:00:00.000Z'));
    });
  });
});
