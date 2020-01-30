import React from 'react';
import { shallow } from 'enzyme';
import Above from '../index';

jest.mock('../../../context');

describe('engage > components > view > components > above', () => {
  it('should render above', () => {
    const wrapper = shallow(<Above />).dive();
    expect(wrapper).toMatchSnapshot();
  });
});
