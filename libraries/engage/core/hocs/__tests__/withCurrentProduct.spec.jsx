import React from 'react';
import { mount } from 'enzyme';
import { withCurrentProduct } from '../withCurrentProduct';

jest.mock('@shopgate/pwa-common/context', () => {
  // eslint-disable-next-line global-require
  const { createContext } = require('react');

  return {
    ThemeContext: createContext({
      contexts: {
        ProductContext: createContext({
          id: '123',
          name: 'acme',
          price: {
            currency: 'EUR',
            unitPrice: 22.95,
            unitPriceStriked: 25.95,
          },
        }),
      },
    }),
  };
});

// eslint-disable-next-line require-jsdoc
const MockComponent = () => null;

describe('engage > core > hocs > withCurrentProduct', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should inject the context properties into the component', () => {
    const ComposedComponent = withCurrentProduct(MockComponent);
    const wrapper = mount(<ComposedComponent someProp />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(MockComponent).props()).toEqual({
      someProp: true,
      id: '123',
      name: 'acme',
      price: {
        currency: 'EUR',
        unitPrice: 22.95,
        unitPriceStriked: 25.95,
      },
    });
  });

  it('should inject a single property with the context into the component', () => {
    const ComposedComponent = withCurrentProduct(MockComponent, { prop: 'product' });
    const wrapper = mount(<ComposedComponent someProp />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(MockComponent).props()).toEqual({
      someProp: true,
      product: {
        id: '123',
        name: 'acme',
        price: {
          currency: 'EUR',
          unitPrice: 22.95,
          unitPriceStriked: 25.95,
        },
      },
    });
  });
});
