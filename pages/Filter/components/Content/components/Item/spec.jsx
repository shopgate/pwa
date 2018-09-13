import React from 'react';
import { shallow } from 'enzyme';
import Item from './index';

describe('Filter: <Item />', () => {
  it('should render', () => {
    const wrapper = shallow((
      <Item>
        <div>Some</div>
      </Item>
    ));

    expect(wrapper).toMatchSnapshot();
  });
});
