import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import mockConsole from 'jest-mock-console';
import { ProductProperties } from '../ProductProperties';
import { makeGetProductProperties } from '../../../selectors/product';
import { isBeta } from '../../../../core';

const mockStore = configureStore();
const store = mockStore({});

jest.mock('../../../selectors/product', () => ({
  makeGetProductProperties: jest.fn(() => jest.fn()),
}));

jest.mock('../../../../core', () => ({
  isBeta: jest.fn(),
}));

const properties = [
  { displayGroup: 'test' },
];

describe('<ProductProperties />', () => {
  it('should not render if no properties where passed', () => {
    makeGetProductProperties.mockReturnValueOnce(() => null);
    const wrapper = mount(<ProductProperties key="1" store={store} />);
    expect(wrapper.find('ProductPropertiesContainer').instance()).toEqual(null);
  });

  it('should render the simple properties if not in beta', () => {
    const restoreConsole = mockConsole();
    makeGetProductProperties.mockReturnValueOnce(() => properties);
    isBeta.mockReturnValueOnce(false);
    const wrapper = mount(<ProductProperties key="2" store={store} />);
    expect(wrapper.find('ProductPropertiesContainer').find('ProductPropertiesSimple').length).toEqual(1);
    expect(wrapper.find('ProductPropertiesContainer').find('ProductPropertiesGrouped').length).toEqual(0);
    restoreConsole();
  });

  it('should render the grouped properties if in beta', () => {
    const restoreConsole = mockConsole();
    makeGetProductProperties.mockReturnValueOnce(() => properties);
    isBeta.mockReturnValueOnce(true);
    const wrapper = mount(<ProductProperties key="3" store={store} />);
    restoreConsole();
    expect(wrapper.find('ProductPropertiesContainer').find('ProductPropertiesSimple').length).toEqual(0);
    expect(wrapper.find('ProductPropertiesContainer').find('ProductPropertiesGrouped').length).toEqual(1);
  });
});
