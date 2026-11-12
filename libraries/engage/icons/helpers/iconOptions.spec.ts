import { isValidStrokeWidth, pickIconOptions } from './iconOptions';

describe('engage > icons > helpers > iconOptions', () => {
  it.each([
    [1.5, true],
    [0, false],
    [-1, false],
    [Infinity, false],
    [NaN, false],
    ['2', false],
    [undefined, false],
  ])('checks whether %j is a usable stroke width', (value, expected) => {
    expect(isValidStrokeWidth(value)).toBe(expected);
  });

  it('picks the options of a definition', () => {
    expect(pickIconOptions({
      svg: '<svg/>',
      keepColors: true,
      scale: 0.9,
      strokeWidth: 2,
    })).toEqual({
      keepColors: true,
      scale: 0.9,
      strokeWidth: 2,
    });
  });

  it('drops options of the wrong type', () => {
    expect(pickIconOptions({
      keepColors: 'yes',
      scale: '2',
      strokeWidth: 0,
    } as unknown as Parameters<typeof pickIconOptions>[0])).toEqual({ keepColors: false });
  });
});
