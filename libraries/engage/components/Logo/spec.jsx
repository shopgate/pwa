import React from 'react';
import { shallow } from 'enzyme';
import Logo from './index';

jest.mock('./connector', () => Component => Component);

describe('<Logo />', () => {
  it('should render an image', () => {
    const wrapper = shallow(<Logo />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('img').exists()).toBe(true);
  });
});
