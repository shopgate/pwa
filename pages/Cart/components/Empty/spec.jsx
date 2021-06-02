import React from 'react';
import { shallow } from 'enzyme';
import Empty from './index';

describe('<CartEmpty />', () => {
  it('should render', () => {
    const wrapper = shallow(<Empty />);

    expect(wrapper).toMatchSnapshot();
  });
});
