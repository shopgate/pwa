import React from 'react';
import { render } from '@shopgate/pwa-unit-test/rtlUtils';
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
