import React from 'react';
import { render } from '@testing-library/react';
import InfoField from './index';

describe('<InfoField>', () => {
  it('should render info field', () => {
    const wrapper = render((
      <InfoField>
        Some info text
      </InfoField>
    ));
    expect(wrapper.asFragment()).toMatchSnapshot();
  });
});
