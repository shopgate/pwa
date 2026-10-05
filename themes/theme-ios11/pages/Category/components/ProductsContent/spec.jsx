/* eslint-disable react/prop-types */
import { render, screen } from '@testing-library/react';
import Products from '../Products';
import ProductsContent from './index';

jest.mock('@shopgate/engage/a11y', () => ({
  Section: ({ children, title }) => <section aria-label={title}>{children}</section>,
}));
jest.mock('../Products', () => jest.fn(() => null));

describe('<ProductsContent />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with products', () => {
    render(<ProductsContent hasProducts categoryId="1234" />);

    expect(screen.getByRole('region', { name: 'category.sections.products' })).toBeInTheDocument();
    expect(Products.mock.lastCall[0]).toEqual({
      categoryId: '1234',
      filters: undefined,
      routeId: '',
      sort: 'relevance',
    });
  });

  it('should render without products', () => {
    const { container } = render(<ProductsContent categoryId="1234" />);

    expect(container).toBeEmptyDOMElement();
    expect(Products).not.toHaveBeenCalled();
  });
});
/* eslint-enable react/prop-types */
