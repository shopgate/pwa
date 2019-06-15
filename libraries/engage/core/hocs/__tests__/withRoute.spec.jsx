import React from 'react';
import { mount } from 'enzyme';
import { withRoute } from '../withRoute';

const mockRoute = {
  id: '32d55',
  pathname: '/',
  pattern: '/',
  state: {},
};

const mockContext = jest.fn().mockReturnValue(mockRoute);

jest.mock('@shopgate/pwa-common/context', () => ({
  RouteContext: {
    Consumer: ({ children }) => children(mockContext()),
  },
}));

// eslint-disable-next-line require-jsdoc
const MockComponent = () => null;

describe('engage > core > hocs > withRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should inject the context properties into the component', () => {
    const ComposedComponent = withRoute(MockComponent);
    const wrapper = mount(<ComposedComponent someProp />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(MockComponent).props()).toEqual({
      someProp: true,
      ...mockRoute,
    });
  });

  it('should inject a single property with the context into the component', () => {
    const ComposedComponent = withRoute(MockComponent, { prop: 'route' });
    const wrapper = mount(<ComposedComponent someProp />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(MockComponent).props()).toEqual({
      someProp: true,
      route: {
        ...mockRoute,
      },
    });
  });
});
