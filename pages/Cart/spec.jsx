import React from 'react';
import { shallow } from 'enzyme';
import Cart from './index';

jest.mock('../../components/View/context.js');

describe('<Cart> page', () => {
  it('should match snapshot', () => {
    const component = shallow(<Cart />);
    expect(component).toMatchSnapshot();
  });
});
