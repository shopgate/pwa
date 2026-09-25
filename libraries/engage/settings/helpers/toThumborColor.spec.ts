import { logger } from '@shopgate/pwa-core/helpers';
import { toThumborColor } from './toThumborColor';

jest.mock('@shopgate/pwa-core/helpers', () => ({
  logger: { warn: jest.fn() },
}));

describe('settings / helpers / toThumborColor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('opaque colors', () => {
    it.each([
      ['FFFFFF', 'FFFFFF'],
      ['#FFFFFF', 'FFFFFF'],
      ['#fff', 'FFFFFF'],
      ['rgb(255, 255, 255)', 'FFFFFF'],
      ['hsl(0, 0%, 100%)', 'FFFFFF'],
      ['white', 'FFFFFF'],
      ['#ff5400', 'FF5400'],
      // The bare hex the legacy AppImages config stores, and the format the service expects back.
      ['AAA', 'AAAAAA'],
      ['ff5400', 'FF5400'],
    ])('converts %s to %s', (input, expected) => {
      expect(toThumborColor(input)).toBe(expected);
      expect(logger.warn).not.toHaveBeenCalled();
    });

    it('never emits a comma, which the image service url would encode', () => {
      expect(toThumborColor('rgb(255, 84, 0)')).not.toContain(',');
    });
  });

  describe('alpha', () => {
    // Thumbor's fill color has no alpha channel, so any alpha on the input is simply dropped and
    // the opaque colour is used.
    it.each([
      ['rgba(255, 255, 255, 0.5)', 'FFFFFF'],
      ['#FFFFFF80', 'FFFFFF'],
      ['rgba(255, 255, 255, 0)', 'FFFFFF'],
      ['#FFFFFF00', 'FFFFFF'],
      ['rgba(0, 0, 0, 0)', '000000'],
    ])('drops the alpha of %s and returns %s', (input, expected) => {
      expect(toThumborColor(input)).toBe(expected);
      expect(logger.warn).not.toHaveBeenCalled();
    });

    it('never returns an eight digit hex', () => {
      expect(toThumborColor('#FFFFFF80')).toHaveLength(6);
    });
  });

  describe('image service keywords', () => {
    it.each(['auto', 'blur', 'transparent'])('passes %s through untouched', (keyword) => {
      expect(toThumborColor(keyword)).toBe(keyword);
      expect(logger.warn).not.toHaveBeenCalled();
    });

    it('normalizes casing and surrounding whitespace', () => {
      expect(toThumborColor('  AUTO ')).toBe('auto');
    });
  });

  describe('invalid input', () => {
    // null and 42 guard against sources that do not honor the type - the payload arrives from a
    // remote jsonp file, so nothing enforces it at runtime.
    it.each([
      'nonsense',
      '',
      null,
      42,
    ])('falls back to the default for %s and warns', (input) => {
      expect(toThumborColor(input as string)).toBe('FFFFFF');
      expect(logger.warn).toHaveBeenCalledTimes(1);
    });
  });
});
