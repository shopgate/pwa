import React from 'react';
import { mount } from 'enzyme';
import withPageState from './withPageState';

const isLoadingSpy = jest.fn();
// eslint-disable-next-line require-jsdoc
const mockedIsLoading = (...args) => {
  isLoadingSpy(...args);
  return true;
};

// eslint-disable-next-line react/prop-types, require-jsdoc
const TestingComponent = props => <div>Other prop: {props.foo}</div>;

jest.mock('@shopgate/pwa-common/providers/', () => ({
  LoadingContext: {
    // eslint-disable-next-line react/prop-types
    Consumer: ({ children, ...otherProps }) => {
      const Child = children;
      return <Child isLoading={mockedIsLoading} {...otherProps} />;
    },
  },
}));

jest.mock('@shopgate/pwa-common/context', () => ({
  RouteContext: {
    // eslint-disable-next-line react/prop-types
    Consumer: ({ children, ...otherProps }) => {
      const Child = children;
      return (
        <Child
          pathname="/foo/bar"
          pattern="/foo/:id"
          location="/foo/bar?foo=bar"
          visible
          state={{ title: 'foo' }}
          {...otherProps}
        />
      );
    },
  },
}));

describe('connectors/withPageState', () => {
  it('should render with specified props', () => {
    const ConnectedComponent = withPageState(TestingComponent);
    const component = mount(<ConnectedComponent foo="bar" />);
    expect(isLoadingSpy).toHaveBeenCalledWith('/foo/bar');
    expect(component.find('TestingComponent').props()).toEqual({
      isVisible: true,
      isLoading: true,
      foo: 'bar',
      location: '/foo/bar?foo=bar',
      pattern: '/foo/:id',
      pathname: '/foo/bar',
      state: { title: 'foo' },
    });
  });
});
