import React from 'react';
import { mount } from 'enzyme';
import OptimizedImage from './index';

describe('OptimizedImage', () => {
  it.skip('should render img tag if no sources are provided', () => {
    const wrapper = mount((
      <OptimizedImage
        src="https://example.com/foo.jpeg"
      />
    ));
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.exists('Picture')).toBe(false);
  });

  it('should render Picture element if sources are provided', () => {
    const wrapper = mount((
      <OptimizedImage
        src="https://example.com/foo.jpeg"
        sources={{
          jpeg: 'https://example.com/foo.jpeg',
          png: 'https://example.com/foo.jpeg',
          webp: 'http://example.com/foo.webp',
        }}
      />
    ));
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.exists('Picture')).toBe(true);
  });
});
