import React from 'react';
import { mount } from 'enzyme';
import ProgressiveImage from './index';

window.requestAnimationFrame = () => {};

describe('<ProgressiveImage />', () => {
  it('should render placeholders if forced to', () => {
    const wrapper = mount(<ProgressiveImage srcset={['foo/bar']} forcePlaceholder />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('img').length).toEqual(0);
  });

  it('should render placeholders if src is null', () => {
    const wrapper = mount(<ProgressiveImage srcset={[null]} />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('img').length).toEqual(0);
  });

  it('should render last given loaded image if srcset is given', () => {
    const loadedImages = [];

    // Mocking images immediatly loaded
    global.Image = class {
      constructor() {
        this.complete = true;
        loadedImages.push(this);
      }
    };

    const wrapper = mount(<ProgressiveImage srcset={['someimage', 'someotherimage']} />);

    expect(wrapper).toMatchSnapshot();

    expect(wrapper.find('img').length).toEqual(1);
    expect(wrapper.find('img[src="someotherimage"]').length).toEqual(1);
    expect(wrapper.find('img[src="someimage"]').length).toEqual(0);
  });
});
