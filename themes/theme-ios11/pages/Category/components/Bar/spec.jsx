import React from 'react';
import { shallow } from 'enzyme';
import Bar from './index';

jest.mock('@shopgate/engage/core', () => ({
  withForwardedRef: jest.fn(),
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
