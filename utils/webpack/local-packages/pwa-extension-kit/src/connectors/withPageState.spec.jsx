import { render, screen } from '@testing-library/react';
import withPageState from './withPageState';

const isLoadingSpy = jest.fn();
// eslint-disable-next-line require-jsdoc
const mockedIsLoading = (...args) => {
  isLoadingSpy(...args);
  return true;
};

// eslint-disable-next-line react/prop-types, require-jsdoc
const TestingComponent = jest.fn(props => <div>Other prop: {props.foo}</div>);

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
    render(<ConnectedComponent foo="bar" />);
    expect(isLoadingSpy).toHaveBeenCalledWith('/foo/bar');
    expect(screen.getByText('Other prop: bar')).toBeInTheDocument();
    expect(TestingComponent.mock.lastCall[0]).toEqual({
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
