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
  useScrollContainer: () => false,
  useRoute: () => ({
    state: {
      filters: {},
    },
    params: {
      categoryId: 123,
    },
  }),
}));

jest.mock('@shopgate/engage/components', () => ({
  ViewContext: jest.fn(),
  ResponsiveContainer: ({ children }) => children,
}));
jest.mock('@shopgate/engage/locations', () => ({
  GlobalLocationSwitcher: () => null,
}));

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(() => ({
    ref: {
      current: {},
    },
  })),
}));

describe('<Bar />', () => {
  it('should match snapshot', () => {
    const wrapper = shallow(<Bar />);
    expect(wrapper).toMatchSnapshot();
  });
});
