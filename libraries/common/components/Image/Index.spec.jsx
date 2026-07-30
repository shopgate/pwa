import React from 'react';
import { render } from '@testing-library/react';
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
