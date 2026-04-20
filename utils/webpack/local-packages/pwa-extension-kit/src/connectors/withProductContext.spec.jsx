import React from 'react';
import { mount } from 'enzyme';
import WithProductContext from './withProductContext';

// eslint-disable-next-line react/prop-types, require-jsdoc
const TestingComponent = props => <div>Other prop: {props.foo}</div>;

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
    const component = mount(<ConnectedComponent foo="bar" />);

    expect(component.find('TestingComponent').props()).toEqual({
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
