import React from 'react';
import { shallow } from 'enzyme';
import ValueButton from './index';

describe('<ValueButton />', () => {
  it('should not render of label is missing', () => {
    const wrapper = shallow(<ValueButton id="someid" />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.get(0)).toBe(null);
  });

  it('should not render of id is missing', () => {
    const wrapper = shallow(<ValueButton label="somelabel" />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.get(0)).toBe(null);
  });

  it('should render', () => {
    const wrapper = shallow(<ValueButton id="someid" label="somelabel" />);

    expect(wrapper).toMatchSnapshot();
  });
});
