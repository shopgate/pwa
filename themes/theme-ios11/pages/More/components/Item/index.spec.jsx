import React from 'react';
import { mount } from 'enzyme';
import Item from './index';

jest.mock('@shopgate/engage/components');

const label = 'Item Label';

describe('<Item />', () => {
  it('should render as a button when no href, but a click handler is passed to the props', () => {
    // eslint-disable-next-line require-jsdoc
    const clickHandler = () => {};
    const wrapper = mount(<Item label={label} onClick={clickHandler} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('button').exists()).toBe(true);
    expect(wrapper.find('button').prop('onClick')).toBe(clickHandler);
    expect(wrapper.text()).toBe(label);
  });

  it('should render as a link when an href is passed to the props', () => {
    const href = '/some/link';
    const wrapper = mount(<Item label={label} href={href} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Link').exists()).toBe(true);
    expect(wrapper.find('Link').prop('href')).toBe(href);
    expect(wrapper.find('Text').prop('string')).toBe(label);
  });
});
