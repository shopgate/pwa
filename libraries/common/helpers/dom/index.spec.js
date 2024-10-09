import { getStyle } from './index';

describe('DOM Helpers', () => {
  describe('getStyle()', () => {
    const getComputedStyleSpy = jest.spyOn(window, 'getComputedStyle');

    beforeEach(() => {
      jest.clearAllMocks();
    });

    afterEach(() => {
      // Clear dom after each test
      document.getElementsByTagName('html')[0].innerHTML = '';
    });

    describe('with getComputedStyle', () => {
      describe('dom elements', () => {
        it('should return the expected value when style is added programmatically', () => {
          const element = document.createElement('div');
          element.style.backgroundColor = '#FFF';

          // Mount element to the document
          document.body.appendChild(element);

          expect(getStyle(element, 'backgroundColor')).toBe('rgb(255, 255, 255)');
          expect(getComputedStyleSpy).toHaveBeenCalledTimes(1);
        });

        it('should return the expected value when style applied via inline styles', () => {
          const wrapper = document.createElement('div');
          wrapper.innerHTML = '<div style="background-color: #fff"></div>';
          const element = wrapper.children[0];

          // Mount element to the document
          document.body.appendChild(wrapper);

          expect(getStyle(element, 'backgroundColor')).toBe('rgb(255, 255, 255)');
          expect(getComputedStyleSpy).toHaveBeenCalledTimes(1);
        });

        it('should return the expected value when style applied local style sheet but element has inline styles', () => {
          const wrapper = document.createElement('div');
          wrapper.innerHTML = `
            <style>
              div { background-color: #f00 }
            </style>
            <div id="element" style="background-color: #00f" />`;

          const element = wrapper.querySelector('#element');
          wrapper.appendChild(element);

          // Mount element to the document
          document.body.appendChild(wrapper);

          expect(getStyle(element, 'backgroundColor')).toBe('rgb(0, 0, 255)');
          expect(getComputedStyleSpy).toHaveBeenCalledTimes(1);
        });

        it('should return the expected value when style applied local style sheet', () => {
          const wrapper = document.createElement('div');
          wrapper.innerHTML = `
            <style>
              div { background-color: #f00 }
            </style>`;

          const element = document.createElement('div');
          wrapper.appendChild(element);

          // Mount element to the document
          document.body.appendChild(wrapper);

          expect(getStyle(element, 'backgroundColor')).toBe('rgb(255, 0, 0)');
          expect(getComputedStyleSpy).toHaveBeenCalledTimes(1);
        });

        it('should return an empty string when the property is not set', () => {
          const element = document.createElement('div');

          // Mount element to the document
          document.body.appendChild(element);

          expect(getStyle(element, 'backgroundColor')).toBe('');
          expect(getComputedStyleSpy).toHaveBeenCalledTimes(1);
        });
      });

      describe('dynamically created elements', () => {
        it('should return the expected value when style is added programmatically', () => {
          const element = document.createElement('div');
          element.style.backgroundColor = '#FFF';

          expect(getStyle(element, 'backgroundColor')).toBe('rgb(255, 255, 255)');
          expect(getComputedStyleSpy).not.toHaveBeenCalled();
        });

        it('should return the expected value when style applied via inline styles', () => {
          const wrapper = document.createElement('div');
          wrapper.innerHTML = '<div style="background-color: #fff"></div>';
          const element = wrapper.children[0];

          expect(getStyle(element, 'backgroundColor')).toBe('rgb(255, 255, 255)');
          expect(getComputedStyleSpy).not.toHaveBeenCalled();
        });

        it('should return the expected value when style applied local style sheet but element has inline styles', () => {
          const wrapper = document.createElement('div');
          wrapper.innerHTML = `
            <style>
              div { background-color: #f00 }
            </style>
            <div id="element" style="background-color: #00f" />`;

          const element = wrapper.querySelector('#element');
          wrapper.appendChild(element);

          expect(getStyle(element, 'backgroundColor')).toBe('rgb(0, 0, 255)');
          expect(getComputedStyleSpy).not.toHaveBeenCalled();
        });

        it('should return an empty string when style applied local style sheet', () => {
          const wrapper = document.createElement('div');
          wrapper.innerHTML = `
            <style>
              div { background-color: #f00 }
            </style>`;

          const element = document.createElement('div');
          wrapper.appendChild(element);

          expect(getStyle(element, 'backgroundColor')).toBe('');
          expect(getComputedStyleSpy).not.toHaveBeenCalled();
        });

        it('should return an empty string when the property is not set', () => {
          const element = document.createElement('div');

          expect(getStyle(element, 'backgroundColor')).toBe('');
          expect(getComputedStyleSpy).not.toHaveBeenCalled();
        });
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
