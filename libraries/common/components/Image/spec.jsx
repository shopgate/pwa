import React from 'react';
import { mount } from 'enzyme';
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
    const wrapper = mount(<Image src="foo/bar" forcePlaceholder />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('img').length).toEqual(0);
  });

  it('should render placeholders if src is null', () => {
    const wrapper = mount(<Image src="foo/bar" />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('img').length).toEqual(1);
  });
});
