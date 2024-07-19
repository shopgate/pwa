import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import mockConsole from 'jest-mock-console';
import ProductProperties from '../ProductProperties';
import { makeGetProductProperties } from '../../../selectors/product';

const mockStore = configureStore();
const store = mockStore({});

jest.mock('@shopgate/engage/components');
jest.mock('@shopgate/engage/core', () => ({
  hasWebBridge: () => false,
  withForwardedRef: jest.fn(),
  isIOSTheme: jest.fn(() => false),
}));
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

  it('should not render if no properties where passed', () => {
    makeGetProductProperties.mockReturnValueOnce(() => null);
    const wrapper = mount(<ProductProperties key="1" store={store} />);
    expect(wrapper.find('ProductProperties').instance()).toEqual(null);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render if properties are passed', () => {
    makeGetProductProperties.mockReturnValueOnce(() => properties);
    const wrapper = mount(<ProductProperties key="2" store={store} />);
    expect(wrapper.find('Content').length).toEqual(1);
    expect(wrapper).toMatchSnapshot();
  });
});
