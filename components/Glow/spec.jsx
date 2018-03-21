import React from 'react';
import { mount } from 'enzyme';
import Glow from './index';

describe('<Glow />', () => {
  it('should render with a smile', () => {
    const wrapper = mount((
      <Glow>
        <p>Glowing!</p>
      </Glow>
    ));

    expect(wrapper).toMatchSnapshot();
  });
});
