import { logger } from '@shopgate/pwa-core/helpers';
import { DEFAULT_IMAGE_QUALITY } from '../constants/imageSettings';
import { toImageQuality } from './toImageQuality';

// Several cases feed the helper a value it is meant to reject, which logs a real warning.
jest.mock('@shopgate/pwa-core/helpers', () => ({
  logger: { warn: jest.fn() },
}));

describe('settings / helpers / toImageQuality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    ['a number in range', 40, 40],
    ['the lower bound', 1, 1],
    ['the upper bound', 100, 100],
    ['a numeric string', '85', 85],
    ['a padded numeric string', ' 85 ', 85],
  ])('takes %s', (_, value, expected) => {
    expect(toImageQuality(value)).toBe(expected);
  });

  it('rounds a fractional value', () => {
    expect(toImageQuality(85.4)).toBe(85);
    expect(toImageQuality(85.6)).toBe(86);
  });

  it.each([
    ['above the range', 1000, 100],
    ['below the range', 0, 1],
    ['negative', -5, 1],
  ])('clamps a value that is %s', (_, value, expected) => {
    // A value that is still being typed degrades into the nearest usable one rather than jumping
    // back to the default.
    expect(toImageQuality(value)).toBe(expected);
  });

  it.each([
    ['an empty string', ''],
    ['a blank string', '   '],
    ['not a number', 'abc'],
    ['null', null],
    ['undefined', undefined],
    ['NaN', NaN],
    ['Infinity', Infinity],
  ])('falls back to the default when the value is %s', (_, value) => {
    // An empty admin field must not read as zero, which is what Number() would make of it.
    expect(toImageQuality(value)).toBe(DEFAULT_IMAGE_QUALITY);
    expect(logger.warn).toHaveBeenCalled();
  });

  it('is idempotent', () => {
    const once = toImageQuality('85');

    expect(toImageQuality(once)).toBe(once);
  });
});
