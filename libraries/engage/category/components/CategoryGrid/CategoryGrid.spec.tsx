import type { ReactNode } from 'react';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useSelector } from 'react-redux';
import {
  getCategoryImageRatio,
  getProductTileNameMaxLines,
} from '@shopgate/engage/settings/selectors/appSettings';
import CategoryGrid from './index';

let mockRatio = {
  width: 4,
  height: 3,
};
let mockPlaceholder: string | null = null;

jest.mock('react-redux', () => ({ useSelector: jest.fn() }));
jest.mock('@shopgate/engage/settings/selectors/appSettings', () => ({
  getCategoryImageRatio: jest.fn(),
  getProductTileNameMaxLines: jest.fn(),
}));
jest.mock('@shopgate/engage/settings/selectors/shopSettings', () => ({
  getCategoryImagePlaceholder: jest.fn(),
}));
jest.mock('@shopgate/engage/core/helpers', () => ({
  i18n: { text: (key: string) => key },
}));
jest.mock('@shopgate/engage/category/helpers', () => ({
  getCategoryRoute: (id: string) => `/category/${id}`,
  getShowAllProductsFilters: () => ({}),
}));
jest.mock('@shopgate/engage/category/hooks', () => ({ useCategoryGridColumns: () => 2 }));
jest.mock('@shopgate/engage/product/hooks', () => ({ useProductImageShadow: () => true }));
jest.mock('@shopgate/engage/components', () => ({
  Portal: ({ children }: { children: ReactNode }) => children,
  Ellipsis: ({ children, rows }: { children: ReactNode; rows?: number }) => (
    <span data-rows={rows}>{children}</span>
  ),
  TextLink: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
  Image: ({ src, ratio, placeholder }: {
    src?: string | null; ratio?: number[]; placeholder?: ReactNode;
  }) => (
    src
      ? <img alt="" data-testid="image" src={src} data-ratio={ratio?.join(':')} />
      : <div data-testid="image-fallback">{placeholder}</div>
  ),
}));

const categories = [
  {
    id: 'a',
    name: 'Jackets',
    imageUrl: 'https://img.example/a.png',
  },
  {
    id: 'b',
    name: 'Shirts',
    imageUrl: null,
  },
];

describe('<CategoryGrid />', () => {
  beforeEach(() => {
    mockRatio = {
      width: 4,
      height: 3,
    };
    mockPlaceholder = null;
    (useSelector as jest.Mock).mockImplementation((selector) => {
      if (selector === getCategoryImageRatio) {
        return mockRatio;
      }

      return selector === getProductTileNameMaxLines ? 2 : mockPlaceholder;
    });
  });

  it('renders a labelled list with a linked tile per category', () => {
    render(<CategoryGrid categories={categories} />);

    const list = screen.getByRole('list', { name: 'category.sections.categories' });
    expect(within(list).getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByRole('link', { name: 'Jackets' })).toHaveAttribute('href', '/category/a');
    expect(screen.getByRole('link', { name: 'Shirts' })).toHaveAttribute('href', '/category/b');
  });

  it('clamps names to the lines configured for tiles', () => {
    render(<CategoryGrid categories={categories} />);

    expect(screen.getByText('Jackets')).toHaveAttribute('data-rows', '2');
  });

  it('requests images in the configured ratio', () => {
    render(<CategoryGrid categories={categories} />);

    expect(within(screen.getByRole('link', { name: 'Jackets' })).getByTestId('image'))
      .toHaveAttribute('data-ratio', '4:3');
  });

  it('falls back to a square for an invalid ratio', () => {
    mockRatio = {
      width: 0,
      height: 3,
    };
    render(<CategoryGrid categories={categories} />);

    expect(within(screen.getByRole('link', { name: 'Jackets' })).getByTestId('image'))
      .toHaveAttribute('data-ratio', '1:1');
  });

  it('keeps the image space of categories without an image', () => {
    render(<CategoryGrid categories={categories} />);

    expect(within(screen.getByRole('link', { name: 'Shirts' })).getByTestId('image-fallback'))
      .toBeInTheDocument();
  });

  it('starts with an entry for all products of the parent category', () => {
    render(<CategoryGrid
      categories={categories}
      parentCategory={{
        id: 'p',
        name: 'Men',
      }}
      showAllProducts
    />);

    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveTextContent('category.showAllProducts.label');
    expect(links[0]).toHaveAttribute('href', '/category/p/all');
    expect(links).toHaveLength(3);
  });

  it('shows no links while loading', () => {
    render(<CategoryGrid categories={null} prerender={3} />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('renders nothing without categories', () => {
    const { container } = render(<CategoryGrid categories={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
