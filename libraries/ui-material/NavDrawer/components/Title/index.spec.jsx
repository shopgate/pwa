import React from 'react';
import { mount } from 'enzyme';
import NavDrawerTitle from './index';

describe('<NavDrawerTitle />', () => {
  it('should render when a text is passed within the props', () => {
    const title = 'Title';
    const wrapper = mount(<NavDrawerTitle text={title} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.text()).toEqual(title);
    expect(wrapper.find('Translate').prop('string')).toEqual(title);
  });

  it('should not render when no text is passed within the props', () => {
    const wrapper = mount(<NavDrawerTitle />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.isEmptyRender()).toBe(true);
  });
});
