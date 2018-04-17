import React from 'react';
import { mount } from 'enzyme';
import PlaceholderLabel from './index';

describe('<PlaceholderLabel />', () => {
  it('should render placeholder ', () => {
    const wrapper = mount((
      <PlaceholderLabel ready={false}>
        <h1>foo</h1>
      </PlaceholderLabel>
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('h1').length).toEqual(0);
  });

  it('should render children', () => {
    const wrapper = mount((
      <PlaceholderLabel ready>
        <h1>foo</h1>
      </PlaceholderLabel>
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('h1').length).toEqual(1);
  });
});
