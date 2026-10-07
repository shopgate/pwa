import { render, screen } from '@testing-library/react';
import withThemeComponents from './withThemeComponents';

// eslint-disable-next-line react/prop-types, require-jsdoc
const TestingComponent = jest.fn(props => <div>Other prop: {props.foo}</div>);

jest.mock('@shopgate/pwa-common/context', () => ({
  // eslint-disable-next-line react/prop-types
  Theme: ({ children, ...otherProps }) => {
    const Child = children;

    const props = {
      AppBar: () => null,
      Drawer: () => null,
      View: () => null,
      contexts: {
        ProductContext: {},
      },
      ...otherProps,
    };

    return (
      <Child {...props} />
    );
  },
}));

describe('connectors/withThemeComponents', () => {
  it('should render with specified props', () => {
    const ConnectedComponent = withThemeComponents(TestingComponent);
    render(<ConnectedComponent foo="bar" />);

    expect(screen.getByText('Other prop: bar')).toBeInTheDocument();

    const [[props]] = TestingComponent.mock.calls;

    expect(props.contexts).toBeUndefined();
    expect(props.foo).toBe('bar');

    expect(Object.keys(props)).toMatchObject([
      'AppBar',
      'Drawer',
      'View',
      'foo',
    ]);
  });
});
