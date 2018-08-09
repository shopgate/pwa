import React from 'react';
import { mount } from 'enzyme';
import Picture from './index';

describe('Picture', () => {
  it('should render source set with webp on top', () => {
    const component = mount((
      <Picture
        sources={{
          jpeg: 'https://example.com/foo.jpeg',
          webp: 'http://example.com/foo.webp'
        }}
      />
    ));
    expect(component.find('source').at(0).props().srcSet.endsWith('webp')).toBe(true);
  });
})