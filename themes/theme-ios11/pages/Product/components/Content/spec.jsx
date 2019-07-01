import React from 'react';
import { shallow } from 'enzyme';
import Content from './index';

jest.mock('@shopgate/engage/product', () => ({
  ProductProperties: () => null,
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
jest.mock('../AddToCartBar', () => () => null);
jest.mock('Components/Reviews', () => () => null);
jest.mock('./connector', () => Component => Component);

describe('Product / Content', () => {
  it('should provide correct context value', () => {
    const wrapper = shallow(<Content productId="SG100" />);

    const expected = expect.objectContaining({
      productId: 'SG100',
      quantity: 1,
    });

    expect(wrapper.find('ContextProvider').prop('value')).toEqual(expected);
  });
});
