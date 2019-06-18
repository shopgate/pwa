import React from 'react';
import { mount } from 'enzyme';
import Picker from './index';

jest.mock('Components/View/context', () => ({
  ViewContext: {
    Consumer: ({ children }) => children({ setAriaHidden: () => { } }),
  },
}));

describe('<Picker />', () => {
  it('should render the picker', () => {
    const label = 'Picker label';

    const wrapper = mount(<Picker label={label} />);

    expect(wrapper).toMatchSnapshot();
  });
});
