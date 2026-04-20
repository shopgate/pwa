import React from 'react';
import { mount } from 'enzyme';
import withThemeComponents from './withThemeComponents';

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
    const component = mount(<ConnectedComponent foo="bar" />);

    expect(component.find('TestingComponent').prop('contexts')).toBeUndefined();

    expect(Object.keys(component.find('TestingComponent').props())).toMatchObject([
      'AppBar',
      'Drawer',
      'View',
      'foo',
    ]);
  });
});
