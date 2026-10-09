/* eslint-disable react/prop-types */
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { hasNewServices } from '@shopgate/engage/core/helpers';
import { useCategorySettings } from '@shopgate/engage/category/hooks';
import { useFilterBarSettings } from '@shopgate/engage/product/hooks';
import Content from './index';

jest.mock('./connector', () => component => component);
jest.mock('@shopgate/engage/core/helpers', () => ({ hasNewServices: jest.fn() }));
jest.mock('@shopgate/engage/core', () => ({ VIEW_CONTENT: 'view.content' }));
jest.mock('@shopgate/engage/components', () => ({
  SurroundPortals: ({ children }) => children,
}));
jest.mock('@shopgate/engage/category/hooks', () => ({ useCategorySettings: jest.fn() }));
jest.mock('@shopgate/engage/product/hooks', () => ({ useFilterBarSettings: jest.fn() }));
jest.mock('@shopgate/engage/product/components', () => ({
  ProductFilters: ({ showFilters, contentBefore }) => (
    <div>
      {contentBefore}
      {showFilters && <button type="button">filter</button>}
    </div>
  ),
}));
jest.mock('../CategoryListContent', () => ({ showList, layout }) => (
  showList ? <ul aria-label={`subcategories ${layout}`} /> : null
));
jest.mock('../SubcategoryChips', () => () => <ul aria-label="chips" />);
jest.mock('../ProductsContent', () => () => null);
jest.mock('../Empty', () => () => null);
jest.mock('../AppBar', () => () => null);
/* eslint-enable react/prop-types */

const setup = ({
  layout = 'list', chips = false, showOnParentCategories = false, newServices = false,
} = {}) => {
  useCategorySettings.mockReturnValue({
    layout,
    showImages: true,
    showAllProducts: false,
  });
  useFilterBarSettings.mockReturnValue({
    showSubcategoryChips: chips,
    showOnParentCategories,
    hideOnScroll: true,
  });
  hasNewServices.mockReturnValue(newServices);
};

const renderContent = props => render(<Content categoryId="1" {...props} />);

describe('<CategoryContent /> filter bar and subcategories', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('hides sort and filter on parent categories by default', () => {
    setup();
    renderContent({
      hasChildren: true,
      hasProducts: true,
    });

    expect(screen.queryByRole('button', { name: 'filter' })).not.toBeInTheDocument();
  });

  it('shows sort and filter on parent categories when configured', () => {
    setup({ showOnParentCategories: true });
    renderContent({
      hasChildren: true,
      hasProducts: true,
    });

    expect(screen.getByRole('button', { name: 'filter' })).toBeInTheDocument();
  });

  it('shows sort and filter on parent categories with new services', () => {
    setup({ newServices: true });
    renderContent({
      hasChildren: true,
      hasProducts: true,
    });

    expect(screen.getByRole('button', { name: 'filter' })).toBeInTheDocument();
  });

  it('never shows sort and filter without products', () => {
    setup({ showOnParentCategories: true });
    renderContent({
      hasChildren: true,
      hasProducts: false,
    });

    expect(screen.queryByRole('button', { name: 'filter' })).not.toBeInTheDocument();
  });

  it('shows chips instead of the list above products', () => {
    setup({ chips: true });
    renderContent({
      hasChildren: true,
      hasProducts: true,
    });

    expect(screen.getByRole('list', { name: 'chips' })).toBeInTheDocument();
    expect(screen.queryByRole('list', { name: /subcategories/ })).not.toBeInTheDocument();
  });

  it('falls back to the configured layout when chips have no products below them', () => {
    setup({
      layout: 'grid',
      chips: true,
    });
    renderContent({
      hasChildren: true,
      hasProducts: false,
    });

    expect(screen.queryByRole('list', { name: 'chips' })).not.toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'subcategories grid' })).toBeInTheDocument();
  });
});
