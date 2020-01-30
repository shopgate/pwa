import React from 'react';
import { mount } from 'enzyme';
import Picker from './index';

jest.mock('@shopgate/engage/components/View');

describe('<Picker />', () => {
  it('should render the picker', () => {
    const label = 'Picker label';
    const wrapper = mount(<Picker label={label} />);
    expect(wrapper).toMatchSnapshot();
  });
});
