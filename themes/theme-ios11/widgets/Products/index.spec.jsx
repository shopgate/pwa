import React from 'react';
import { render, screen } from '@shopgate/pwa-unit-test/rtlUtils';
import ProductsWidgets from './index';

const mockProductsIdsWidget = jest.fn(() => <div data-testid="products-ids-widget" />);
const mockProductsWidget = jest.fn(() => <div data-testid="products-widget" />);

jest.mock('./ProductsIdsWidget', () => props => mockProductsIdsWidget(props));
jest.mock('./ProductsWidget', () => props => mockProductsWidget(props));
jest.mock('react-redux', () => ({
  connect: jest.fn(() => component => component),
}));

describe('<ProductWidgets />', () => {
  const settings = {
    headline: '',
    layout: 'grid',
    productLimit: 6,
    queryParams: 'Blue',
    queryType: 2,
  };

  it('should render the products widget', () => {
    render(<ProductsWidgets settings={settings} />);

    expect(screen.getByTestId('products-widget')).toBeTruthy();
    expect(screen.queryByTestId('products-ids-widget')).toBeNull();
  });

  it('should render the products ids widget', () => {
    render(<ProductsWidgets settings={{
      ...settings,
      queryType: 4,
      queryParams: [1, 2, 4],
    }}
    />);

    expect(screen.getByTestId('products-ids-widget')).toBeTruthy();
    expect(screen.queryByTestId('products-widget')).toBeNull();
  });
});
