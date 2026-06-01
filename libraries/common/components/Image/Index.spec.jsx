import React from 'react';
import { render } from '@testing-library/react';
import Image from './index';

window.requestAnimationFrame = () => { };
jest.unmock('@shopgate/pwa-core');

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
    const { container } = render(<Image src="foo/bar" forcePlaceholder />);

    expect(container.firstChild).toMatchSnapshot();
    expect(container.querySelectorAll('img')).toHaveLength(0);
  });

  it('should render placeholders if src is null', () => {
    const { container } = render(<Image src="foo/bar" />);

    expect(container.firstChild).toMatchSnapshot();
    expect(container.querySelectorAll('img')).toHaveLength(1);
  });
});
