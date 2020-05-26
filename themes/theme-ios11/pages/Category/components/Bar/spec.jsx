import React from 'react';
import { shallow } from 'enzyme';
import Bar from './index';

jest.mock('@shopgate/engage/core', () => ({
  withForwardedRef: jest.fn(),
  withWidgetSettings: component => component,
  withCurrentProduct: component => component,
  withRoute: component => component,
  withApp: component => component,
  isIOSTheme: () => false,
  hasWebBridge: () => false,
  useRoute: () => ({
    state: {
      filters: {},
    },
    params: {
      categoryId: 123,
    },
  }),
}));

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(() => ({
    ref: {
      current: {},
    },
  })),
}));

jest.mock('@shopgate/engage/components/View', () => ({
  ViewContext: jest.fn(),
}));

describe('<Bar />', () => {
  it('should match snapshot', () => {
    const wrapper = shallow(<Bar />);
    expect(wrapper).toMatchSnapshot();
  });
});
