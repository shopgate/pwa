import React from 'react';
import { render } from '@testing-library/react';
import Item from './index';

describe('Filter: <Item />', () => {
  it('should render', () => {
    const wrapper = render((
      <Item>
        <div>Some</div>
      </Item>
    ));

    expect(wrapper.asFragment()).toMatchSnapshot();
  });
});
