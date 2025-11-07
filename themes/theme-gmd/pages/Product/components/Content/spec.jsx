import React from 'react';
import { shallow } from 'enzyme';
import Content from './index';

jest.mock('@shopgate/engage/a11y', () => ({
  Section: ({ children }) => children,
}));
jest.mock('@shopgate/engage/reviews', () => ({
  Reviews: ({ children }) => children,
}));
jest.mock('@shopgate/engage/product/components', () => ({
  ProductProperties: ({ children }) => children,
  RelationsSlider: ({ children }) => children,
  Description: ({ children }) => children,
  UnitQuantityPickerWithSection: ({ children }) => children,
  OrderQuantityHint: () => null,
  Options: () => null,
  Characteristics: () => null,
}));
jest.mock('@shopgate/engage/product/contexts', () => ({
  ProductContext: {
    Provider: ({ children }) => children,
  },
}));
jest.mock('@shopgate/engage/product');
jest.mock('@shopgate/engage/locations', () => ({
  FulfillmentSelector: ({ children }) => children,
  FulfillmentSheet: ({ children }) => children,
  FulfillmentPathSelector: ({ children }) => children,
}));
jest.mock('@shopgate/engage/components');
jest.mock('@shopgate/pwa-core', () => ({
  Conditioner: jest.fn(),
  hasSGJavaScriptBridge: jest.fn().mockReturnValue(false),
}));

jest.mock('@shopgate/pwa-ui-shared/TaxDisclaimer', () => () => null);

jest.mock('../Media', () => () => null);
jest.mock('../Header', () => () => null);
jest.mock('../AppBar', () => () => null);
jest.mock('../ContentWide', () => () => null);
jest.mock('./connector', () => Component => Component);

describe('Product / Content', () => {
  const expectedContext = {
    productId: 'SG100',
    quantity: 1,
    options: {},
    optionsPrices: {},
  };

  it('should provide correct context value', () => {
    const wrapper = shallow(<Content productId="SG100" />);
    expect(wrapper.find('Provider').prop('value')).toEqual(expect.objectContaining(expectedContext));
  });

  it('should reset options on product update', () => {
    const wrapper = shallow(<Content productId="SG100" />);

    wrapper.update(wrapper.instance().setOption('op1', 'OP_V', 0));
    expect(wrapper.find('Provider').prop('value')).toEqual(expect.objectContaining({
      ...expectedContext,
      options: { op1: 'OP_V' },
      optionsPrices: { op1: 0 },
    }));

    wrapper.update(wrapper.setProps({ productId: 'SG200' }));
    expect(wrapper.find('Provider').prop('value')).toEqual(expect.objectContaining({
      ...expectedContext,
      productId: 'SG200',
    }));
  });
});
