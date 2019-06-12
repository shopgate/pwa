import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import mockConsole from 'jest-mock-console';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import ProductProperties from '../ProductProperties';
import { makeGetProductProperties } from '../../../selectors/product';

const mockStore = configureStore();
const store = mockStore({});

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
    const wrapper = mount(<ProductProperties key="1" store={store} />, mockRenderOptions);
    expect(wrapper.find('ProductProperties').instance()).toEqual(null);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render if properties are passed', () => {
    makeGetProductProperties.mockReturnValueOnce(() => properties);
    const wrapper = mount(<ProductProperties key="2" store={store} />, mockRenderOptions);
    expect(wrapper.find('Content').length).toEqual(1);
    expect(wrapper).toMatchSnapshot();
  });
});
