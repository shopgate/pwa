import React from 'react';
import { mount } from 'enzyme';
import withPageProductId from './withPageProductId';

let mockedProductId;

const mockedLogger = jest.fn();
jest.mock('../helpers/TaggedLogger', () => class MockedTaggedLogger {
  // eslint-disable-next-line max-len
  // eslint-disable-next-line class-methods-use-this, require-jsdoc, extra-rules/potential-point-free
  warn(...args) {
    mockedLogger(...args);
  }
  // eslint-disable-next-line max-len
  // eslint-disable-next-line class-methods-use-this, require-jsdoc, extra-rules/potential-point-free
  error(...args) {
    mockedLogger(...args);
  }
});

jest.mock('@shopgate/pwa-common/context', () => ({
  RouteContext: {
    Consumer: (props) => {
      // eslint-disable-next-line react/prop-types
      const Child = props.children;
      return <Child params={{ productId: mockedProductId }} />;
    },
  },
}));

describe('connectors/withPageProductId', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // eslint-disable-next-line react/prop-types, require-jsdoc
  const MockedComponent = props => <div>{props.productId}</div>;

  it('should render with productId', () => {
    mockedProductId = '31323334';
    const Component = withPageProductId(MockedComponent);

    const component = mount(<Component otherProp={1} />);
    expect(component.find('MockedComponent').props()).toEqual({
      productId: '1234',
      otherProp: 1,
    });
  });

  it('should render with missing productId', () => {
    mockedProductId = undefined;
    const Component = withPageProductId(MockedComponent);

    const component = mount(<Component otherProp={1} />);
    expect(component.find('MockedComponent').props()).toEqual({
      productId: null,
      otherProp: 1,
    });
    expect(mockedLogger).toHaveBeenCalled();
  });

  it('should render with invalid productId', () => {
    mockedProductId = '123';
    const Component = withPageProductId(MockedComponent);

    const component = mount(<Component otherProp={1} />);
    expect(component.find('MockedComponent').props()).toEqual({
      productId: false,
      otherProp: 1,
    });
    expect(mockedLogger).toHaveBeenCalled();
  });
});
