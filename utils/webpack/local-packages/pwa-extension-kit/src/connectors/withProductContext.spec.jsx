import { render, screen } from '@testing-library/react';
import WithProductContext from './withProductContext';

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
        ProductContext: {
          // eslint-disable-next-line react/prop-types
          Consumer: ({ children: ContextChildren, ...contextProps }) => (
            <ContextChildren
              options={{}}
              productId="123"
              variantId="123-45"
              conditioner={{}}
              {...contextProps}
            />
          ),
        },
      },
      ...otherProps,
    };

    return (
      <Child {...props} />
    );
  },
}));

describe('connectors/withProductContext', () => {
  it('should render with specified props', () => {
    const ConnectedComponent = WithProductContext(TestingComponent);
    render(<ConnectedComponent foo="bar" />);

    expect(screen.getByText('Other prop: bar')).toBeInTheDocument();
    expect(TestingComponent.mock.lastCall[0]).toEqual({
      foo: 'bar',
      productContext: {
        options: {},
        conditioner: {},
        productId: '123',
        variantId: '123-45',
      },
    });
  });
});
