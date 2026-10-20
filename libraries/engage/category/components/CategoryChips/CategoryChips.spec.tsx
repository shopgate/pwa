import type { ReactNode } from 'react';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useSelector } from 'react-redux';
import CategoryChips from './index';

jest.mock('react-redux', () => ({ useSelector: jest.fn() }));
jest.mock('@shopgate/engage/category/hooks', () => ({
  useCategoryImageRatio: () => ({
    ratio: [2, 1],
    resolutions: [{
      width: 270,
      height: 135,
    }],
    aspectRatio: '2 / 1',
    thumbnailWidth: 60,
  }),
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
jest.mock('@shopgate/engage/components', () => ({
  Portal: ({ children, name, props }: {
    children: ReactNode; name: string; props: { categoryId: string };
  }) => <div data-portal={name} data-category-id={props.categoryId}>{children}</div>,
  SurroundPortals: ({ children }: { children: ReactNode }) => children,
  TextLink: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
  Image: ({ src, placeholder }: { src?: string | null; placeholder?: ReactNode }) => (
    src ? <img alt="" data-testid="image" src={src} /> : <div>{placeholder}</div>
  ),
  PlaceholderIcon: () => <svg data-testid="placeholder-icon" />,
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

describe('<CategoryChips />', () => {
  beforeEach(() => {
    (useSelector as jest.Mock).mockReturnValue(null);
  });

  it('renders a labelled list with a linked chip per category', () => {
    render(<CategoryChips categories={categories} />);

    const list = screen.getByRole('list', { name: 'category.sections.categories' });
    expect(within(list).getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByRole('link', { name: 'Jackets' })).toHaveAttribute('href', '/category/a');
    expect(screen.getByRole('link', { name: 'Shirts' })).toHaveAttribute('href', '/category/b');
  });

  it('shows no images by default', () => {
    render(<CategoryChips categories={categories} />);

    expect(screen.queryByTestId('image')).not.toBeInTheDocument();
  });

  it('shows the placeholder icon for categories without an image', () => {
    render(<CategoryChips categories={categories} showImages />);

    expect(within(screen.getByRole('link', { name: 'Jackets' })).getByTestId('image'))
      .toBeInTheDocument();
    expect(within(screen.getByRole('link', { name: 'Shirts' })).getByTestId('placeholder-icon'))
      .toBeInTheDocument();
  });

  it('shows the shop placeholder for categories without an image', () => {
    (useSelector as jest.Mock).mockReturnValue('https://img.example/placeholder.png');
    render(<CategoryChips categories={categories} showImages />);

    expect(within(screen.getByRole('link', { name: 'Shirts' })).getByTestId('image'))
      .toHaveAttribute('src', 'https://img.example/placeholder.png');
  });

  it('passes the category to the portals', () => {
    const { container } = render(<CategoryChips
      categories={categories}
      parentCategory={{
        id: 'p',
        name: 'Men',
      }}
      showAllProducts
    />);

    expect(container.querySelector('[data-portal="category.chips.item"][data-category-id="a"]'))
      .toBeInTheDocument();
    expect(container.querySelector('[data-portal="category.chips.show-all-products"][data-category-id="p"]'))
      .toBeInTheDocument();
  });

  it('starts with a chip for all products of the parent category', () => {
    render(<CategoryChips
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
    render(<CategoryChips categories={null} prerender={9} />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
});
