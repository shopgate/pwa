import React from 'react';
import { shallow } from 'enzyme';
import ProductGrid from 'Components/ProductGrid';
import ProductList from 'Components/ProductList';
import { UnwrappedProductsWidget as ProductsWidget } from './index';

describe('<ProductsWidget />', () => {
  const getProducts = jest.fn();
  const props = {
    id: 'someid',
    products: [],
    totalProductCount: null,
    settings: {
      headline: '',
      layout: 'grid',
      productLimit: 6,
      queryParams: 'Blue',
      queryType: 2,
    },
    getProducts,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the grid only when products are received', () => {
    const wrapper = shallow(<ProductsWidget {...props} />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(ProductGrid).length).toBe(0);

    // Now give it a product...
    wrapper.setProps({
      products: [{}],
      totalProductCount: 1,
    });

    expect(wrapper.find(ProductGrid).length).toBe(1);
    expect(getProducts).toHaveBeenCalledTimes(1);
    expect(getProducts).toHaveBeenCalledWith(
      props.settings.queryType,
      props.settings.queryParams,
      {
        limit: props.settings.productLimit,
        offset: 0,
      },
      props.id
    );
  });

  it('should render the products in the list view', () => {
    const wrapper = shallow(<ProductsWidget {...props} />);

    // Change the layout to a list.
    wrapper.setProps({
      products: [{}],
      settings: {
        headline: '',
        layout: 'list',
      },
      totalProductCount: 1,
    });

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(ProductList).length).toBe(1);
    expect(getProducts).toHaveBeenCalledTimes(1);
    expect(getProducts).toHaveBeenCalledWith(
      props.settings.queryType,
      props.settings.queryParams,
      {
        limit: props.settings.productLimit,
        offset: 0,
      },
      props.id
    );
  });
});
