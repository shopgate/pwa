import React from 'react';
import { render } from '@testing-library/react';
import ItemPrice from './index';

jest.mock('@shopgate/engage/product', () => ({
  ProductGridPrice: () => null,
}));
jest.mock('@shopgate/engage/components');
jest.mock('@shopgate/engage/category', () => ({
  PRODUCT_ITEM_PRICE: 'PRODUCT_ITEM_PRICE',
  PRODUCT_ITEM_PRICE_AFTER: 'PRODUCT_ITEM_PRICE_AFTER',
  PRODUCT_ITEM_PRICE_BEFORE: 'PRODUCT_ITEM_PRICE_BEFORE',
}));

const props = {
  product: {
    id: '1234',
    price: {},
  },
};

const display = {
  price: false,
};

describe('<ItemPrice />', () => {
  it('should render with minimal props', () => {
    const wrapper = render(<ItemPrice {...props} />);
    expect(wrapper.asFragment()).toMatchSnapshot();
  });

  it('should not render with display props set', () => {
    const wrapper = render(<ItemPrice {...props} display={display} />);
    expect(wrapper).toBeEmptyRender();
  });
});
