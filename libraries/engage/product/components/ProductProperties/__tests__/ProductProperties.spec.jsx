import React from 'react';
import { render } from '@shopgate/pwa-unit-test/rtlUtils';
import configureStore from 'redux-mock-store';
import mockConsole from 'jest-mock-console';
import ProductProperties from '../ProductProperties';
import { makeGetProductProperties } from '../../../selectors/product';

const mockStore = configureStore();
const store = mockStore({});

jest.mock('@shopgate/engage/components', () => ({
  SurroundPortals: ({ children }) => children,
}));
jest.mock('@shopgate/engage/core', () => ({
  hasWebBridge: () => false,
  withForwardedRef: jest.fn(),
  isIOSTheme: jest.fn(() => false),
}));
jest.mock('@shopgate/engage/core/hooks/events');
jest.mock('../../../selectors/product', () => ({
  makeGetProductProperties: jest.fn(() => jest.fn()),
}));

const properties = [
  { displayGroup: 'test' },
];

describe('<ProductProperties />', () => {
  let restoreConsole;

  beforeEach(() => {
    restoreConsole = mockConsole();
  });

  afterEach(() => {
    restoreConsole();
  });

  it('should not render if no properties were passed', () => {
    makeGetProductProperties.mockReturnValueOnce(() => null);
    const { container } = render(<ProductProperties key="1" store={store} />);
    expect(container.firstChild).toBeNull();
    expect(container).toMatchSnapshot();
  });

  it('should render if properties are passed', () => {
    makeGetProductProperties.mockReturnValueOnce(() => properties);
    const { container } = render(<ProductProperties key="2" store={store} />);
    expect(container.firstChild).not.toBeNull();
    expect(container).toMatchSnapshot();
  });
});
