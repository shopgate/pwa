import React from 'react';
import { render } from '@testing-library/react';
import Glow from './index';

describe('<Glow />', () => {
  it('should render with a smile', () => {
    const wrapper = render((
      <Glow>
        <p>Glowing!</p>
      </Glow>
    ));

    expect(wrapper.asFragment()).toMatchSnapshot();
  });
});
