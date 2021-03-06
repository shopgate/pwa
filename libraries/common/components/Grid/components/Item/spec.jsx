import React from 'react';
import { shallow } from 'enzyme';
import GridItem from './index';

describe('<GridItem />', () => {
  it('should render without any further props', () => {
    const wrapper = shallow(<GridItem />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should be able to render a custom tag', () => {
    const wrapper = shallow(<GridItem component="section" />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.type()).toEqual('section');
  });

  it('should add custom classes on demand', () => {
    const wrapper = shallow(<GridItem className="custom-class-name" />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.hasClass('custom-class-name')).toEqual(true);
  });
});
