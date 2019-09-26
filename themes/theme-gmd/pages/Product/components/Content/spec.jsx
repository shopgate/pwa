import React from 'react';
import { shallow } from 'enzyme';
import Content from './index';

jest.mock('@shopgate/engage/a11y', () => ({
  Section: () => null,
}));

jest.mock('@shopgate/engage/product', () => ({
  ProductProperties: () => null,
  RelationsSlider: () => null,
}));

jest.mock('@shopgate/pwa-core', () => ({
  Conditioner: jest.fn(),
}));

jest.mock('@shopgate/pwa-ui-shared/TaxDisclaimer', () => () => null);

jest.mock('../Media', () => () => null);
jest.mock('../Header', () => () => null);
jest.mock('../Characteristics', () => () => null);
jest.mock('../Options', () => () => null);
jest.mock('../Description', () => () => null);
jest.mock('../AppBar', () => () => null);
jest.mock('Components/Reviews', () => () => null);
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
    expect(wrapper.find('ContextProvider').prop('value')).toEqual(expect.objectContaining(expectedContext));
  });

  it('should reset options on product update', () => {
    const wrapper = shallow(<Content productId="SG100" />);

    wrapper.update(wrapper.instance().setOption('op1', 'OP_V', 0));
    expect(wrapper.find('ContextProvider').prop('value')).toEqual(expect.objectContaining({
      ...expectedContext,
      options: { op1: 'OP_V' },
      optionsPrices: { op1: 0 },
    }));

    wrapper.update(wrapper.setProps({ productId: 'SG200' }));
    expect(wrapper.find('ContextProvider').prop('value')).toEqual(expect.objectContaining({
      ...expectedContext,
      productId: 'SG200',
    }));
  });
});
