import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Image from './index';

window.requestAnimationFrame = () => { };
jest.unmock('@shopgate/pwa-core');

// The image service settings (quality, fill color) are read from the store, so the component needs
// a Provider. An empty state exercises the selector's fallback onto the built-in defaults.
const store = configureStore()({});

/**
 * Renders the given element inside a redux Provider.
 * @param {JSX.Element} element The element to render.
 * @returns {Object} The render result.
 */
const renderWithStore = element => render(
  <Provider store={store}>
    {element}
  </Provider>
);

describe('<Image />', () => {
  const loadedImages = [];
  global.Image = class {
    /**
     * Saves all images on init
     */
    constructor() {
      this.complete = true;
      loadedImages.push(this);
    }
  };

  it('should render placeholders if forced to', () => {
    const { container } = renderWithStore(<Image src="foo/bar" forcePlaceholder />);

    expect(container.firstChild).toMatchSnapshot();
    expect(container.querySelectorAll('img')).toHaveLength(0);
  });

  it('should render placeholders if src is null', () => {
    const { container } = renderWithStore(<Image src="foo/bar" />);

    expect(container.firstChild).toMatchSnapshot();
    expect(container.querySelectorAll('img')).toHaveLength(1);
  });

  describe('malformed aspect ratios', () => {
    // The admin preview dispatches on every keystroke, so a merchant on their way to "16" sends
    // "", "1", "1." and so on. NaN and Infinity used to recurse in gcd until the stack overflowed.
    it.each([
      ['NaN', [NaN, NaN]],
      ['Infinity', [1, Infinity]],
      ['zero', [0, 0]],
      ['a negative', [-16, 9]],
      ['a fraction', [1, 0.3]],
    ])('should render without throwing for %s', (_, ratio) => {
      expect(() => renderWithStore(<Image src="foo/bar" ratio={ratio} />)).not.toThrow();
    });

    it('should fall back to a square rather than emitting NaN', () => {
      const { container } = renderWithStore(<Image src="foo/bar" ratio={[NaN, NaN]} />);

      expect(container.querySelector('img').style.aspectRatio).toBe('1 / 1');
    });

    it('should render without throwing when there are no resolutions', () => {
      expect(() => renderWithStore(<Image src="foo/bar" resolutions={[]} />)).not.toThrow();
    });

    it('should still reduce a valid ratio', () => {
      const { container } = renderWithStore(<Image src="foo/bar" ratio={[440, 550]} />);

      expect(container.querySelector('img').style.aspectRatio).toBe('4 / 5');
    });
  });

  describe('placeholder', () => {
    const placeholder = <div data-test-id="fallback" />;

    it('should render the placeholder instead of an image when there is no src', () => {
      const { container } = renderWithStore(<Image placeholder={placeholder} />);

      expect(container.querySelector('[data-test-id="fallback"]')).not.toBeNull();
      expect(container.querySelectorAll('img')).toHaveLength(0);
    });

    it('should render the placeholder when the parent forces it', () => {
      const { container } = renderWithStore(
        <Image src="foo/bar" placeholder={placeholder} forcePlaceholder />
      );

      expect(container.querySelector('[data-test-id="fallback"]')).not.toBeNull();
    });

    it('should swap in the placeholder once the image fails', () => {
      const { container } = renderWithStore(<Image src="foo/bar" placeholder={placeholder} />);

      fireEvent.error(container.querySelector('img'));

      expect(container.querySelector('[data-test-id="fallback"]')).not.toBeNull();
      expect(container.querySelectorAll('img')).toHaveLength(0);
    });

    it('should still forward the error to the caller', () => {
      const onError = jest.fn();
      const { container } = renderWithStore(
        <Image src="foo/bar" placeholder={placeholder} onError={onError} />
      );

      fireEvent.error(container.querySelector('img'));

      expect(onError).toHaveBeenCalled();
    });

    // Extensions render Image without a placeholder and handle onError themselves. Taking the
    // element away from them would change what they render today.
    it('should keep a failed image mounted when no placeholder is given', () => {
      const onError = jest.fn();
      const { container } = renderWithStore(<Image src="foo/bar" onError={onError} />);

      fireEvent.error(container.querySelector('img'));

      expect(container.querySelectorAll('img')).toHaveLength(1);
      expect(onError).toHaveBeenCalled();
    });

    it('should keep the placeholder while the source stays the same', () => {
      const { container, rerender } = renderWithStore(
        <Image src="foo/bar" placeholder={placeholder} />
      );

      fireEvent.error(container.querySelector('img'));
      rerender(
        <Provider store={store}>
          <Image src="foo/bar" placeholder={placeholder} className="changed" />
        </Provider>
      );

      expect(container.querySelectorAll('img')).toHaveLength(0);
    });

    // A merchant editing the aspect ratio in the admin can produce dimensions the image service
    // rejects. Once they correct it the url changes, and the image has to come back on its own.
    // The dimensions only reach the url for sources the image service actually serves.
    it('should show the image again once the resolutions change', () => {
      const serviceSrc = 'https://images.shopgate.services/foo/bar.jpg';
      const { container, rerender } = renderWithStore(
        <Image
          src={serviceSrc}
          placeholder={placeholder}
          resolutions={[{
            width: 440,
            height: 4000000,
          }]}
        />
      );

      fireEvent.error(container.querySelector('img'));
      expect(container.querySelectorAll('img')).toHaveLength(0);

      rerender(
        <Provider store={store}>
          <Image
            src={serviceSrc}
            placeholder={placeholder}
            resolutions={[{
              width: 440,
              height: 440,
            }]}
          />
        </Provider>
      );

      expect(container.querySelectorAll('img')).toHaveLength(1);
      expect(container.querySelector('[data-test-id="fallback"]')).toBeNull();
    });

    it('should show the image again once the src changes', () => {
      const { container, rerender } = renderWithStore(
        <Image src="foo/bar" placeholder={placeholder} />
      );

      fireEvent.error(container.querySelector('img'));
      rerender(
        <Provider store={store}>
          <Image src="foo/baz" placeholder={placeholder} />
        </Provider>
      );

      expect(container.querySelectorAll('img')).toHaveLength(1);
    });
  });

  describe('microdata', () => {
    // The product components wrap their images in a schema.org Product, and rich results need the
    // image property. Without forwarding, the attribute never reaches the DOM.
    it('should emit itemprop on the image', () => {
      const { container } = renderWithStore(<Image src="foo/bar" itemProp="image" />);

      expect(container.querySelector('img').getAttribute('itemprop')).toBe('image');
    });

    it('should emit itemprop when unwrapped', () => {
      const { container } = renderWithStore(<Image src="foo/bar" itemProp="image" unwrapped />);

      expect(container.querySelector('img').getAttribute('itemprop')).toBe('image');
    });

    it('should omit the attribute when no itemProp is given', () => {
      const { container } = renderWithStore(<Image src="foo/bar" />);

      expect(container.querySelector('img').hasAttribute('itemprop')).toBe(false);
    });
  });
});
