import React from 'react';
import { shallow } from 'enzyme';
import Icon from './index';

describe('<CartEmptyIcon />', () => {
  it('should render', () => {
    const wrapper = shallow(<Icon />);

    expect(wrapper).toMatchSnapshot();
  });
});
