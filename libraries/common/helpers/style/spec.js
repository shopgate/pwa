import { rem, physicalPixelSize } from './index';

describe('style helper', () => {
  describe('rem helper with 16px rootSize', () => {
    it('should output 0.875rem for 16px input', () => {
      expect(rem(16)).toBe('1rem');
    });

    it('should output 0.875rem for 14px input', () => {
      expect(rem(14)).toBe('0.875rem');
    });

    it('should output 0.75rem for 12px input', () => {
      expect(rem(12)).toBe('0.75rem');
    });

    it('should output 0rem for 0px input', () => {
      expect(rem(0)).toBe('0rem');
    });
  });

  describe('rem helper error handling', () => {
    let consoleSpy;

    beforeAll(() => {
      // Deactivate the console for the next tests to avoid logs within the test report.
      consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterAll(() => {
      consoleSpy.mockRestore();
    });

    afterEach(() => {
      consoleSpy.mockReset();
    });

    it('should output 1rem as fallback for wrong parameters', () => {
      expect(rem('rem')).toBe('1rem');
      expect(consoleSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('physicalPixelSize', () => {
    describe('non-Android devices', () => {
      beforeAll(() => {
        Object.defineProperty(window.navigator, 'userAgent', {
          value: 'Not And... user agent',
          configurable: true,
        });
      });
      it('should output declarations for 1px size', () => {
        expect(physicalPixelSize('foo', 1)).toEqual({
          foo: 1,
          '@media (min-device-pixel-ratio: 2)': {
            foo: 0.5,
          },
          '@media (-webkit-min-device-pixel-ratio: 2)': {
            foo: 0.5,
          },
          '@media (min-device-pixel-ratio: 3)': {
            foo: 0.33,
          },
          '@media (-webkit-min-device-pixel-ratio: 3)': {
            foo: 0.33,
          },
        });
      });
      it('should output declarations for 2px size', () => {
        expect(physicalPixelSize('foo', 2)).toEqual({
          foo: 2,
          '@media (min-device-pixel-ratio: 2)': {
            foo: 1,
          },
          '@media (-webkit-min-device-pixel-ratio: 2)': {
            foo: 1,
          },
          '@media (min-device-pixel-ratio: 3)': {
            foo: 0.67,
          },
          '@media (-webkit-min-device-pixel-ratio: 3)': {
            foo: 0.67,
          },
        });
      });
      it('should output declarations for 3px size', () => {
        expect(physicalPixelSize('foo', 3)).toEqual({
          foo: 3,
          '@media (min-device-pixel-ratio: 2)': {
            foo: 1.5,
          },
          '@media (-webkit-min-device-pixel-ratio: 2)': {
            foo: 1.5,
          },
          '@media (min-device-pixel-ratio: 3)': {
            foo: 1,
          },
          '@media (-webkit-min-device-pixel-ratio: 3)': {
            foo: 1,
          },
        });
      });
    });

    describe('android devices', () => {
      beforeAll(() => {
        Object.defineProperty(window.navigator, 'userAgent', {
          value: 'Foo Android',
          configurable: true,
        });
      });
      it('should return natural number rules only', () => {
        expect(physicalPixelSize('foo', 3)).toEqual({
          foo: 3,
        });
      });
    });
  });
});
