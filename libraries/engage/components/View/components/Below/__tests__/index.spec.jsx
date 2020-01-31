import React from 'react';
import { shallow } from 'enzyme';
import Below from '../index';

jest.mock('../../../context');

describe('engage > components > view > components > below', () => {
  it('should render below', () => {
    const wrapper = shallow(<Below />).dive();
    expect(wrapper).toMatchSnapshot();
  });
});
