import { getStyle } from './index';

describe('DOM Helpers', () => {
  describe('getStyle()', () => {
    const getComputedStyleSpy = jest.spyOn(window, 'getComputedStyle');

    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('without getComputedStyle', () => {
      it('should return the expected value', () => {
        const element = document.createElement('div');
        element.style.backgroundColor = '#FFF';
        expect(getStyle(element, 'backgroundColor')).toBe('rgb(255, 255, 255)');
        expect(getComputedStyleSpy).toHaveBeenCalledTimes(1);
      });

      it('should return an empty string when the property is not set', () => {
        const element = document.createElement('div');
        expect(getStyle(element, 'backgroundColor')).toBe('');
        expect(getComputedStyleSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('without getComputedStyle', () => {
      const computedStyle = window.getComputedStyle;

      beforeAll(() => {
        window.getComputedStyle = null;
      });

      afterAll(() => {
        window.getComputedStyle = computedStyle;
      });

      it('should return the expected value', () => {
        const element = document.createElement('div');
        element.style.backgroundColor = '#FFF';
        expect(getStyle(element, 'backgroundColor')).toBe('rgb(255, 255, 255)');
        expect(getComputedStyleSpy).not.toHaveBeenCalled();
      });

      it('should return an empty string when the property is not set', () => {
        const element = document.createElement('div');
        expect(getStyle(element, 'backgroundColor')).toBe('');
        expect(getComputedStyleSpy).not.toHaveBeenCalled();
      });
    });
  });
});
