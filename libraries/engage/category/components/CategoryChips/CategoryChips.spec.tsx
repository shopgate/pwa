import type { ReactNode } from 'react';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useSelector } from 'react-redux';
import CategoryChips from './index';

jest.mock('react-redux', () => ({ useSelector: jest.fn() }));
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
  Portal: ({ children }: { children: ReactNode }) => children,
  SurroundPortals: ({ children }: { children: ReactNode }) => children,
  TextLink: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
  Image: ({ src }: { src?: string | null }) => <img alt="" data-testid="image" src={src ?? 'placeholder'} />,
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

  it('shows images of categories that have one', () => {
    render(<CategoryChips categories={categories} showImages />);

    expect(within(screen.getByRole('link', { name: 'Jackets' })).getByTestId('image'))
      .toBeInTheDocument();
    expect(within(screen.getByRole('link', { name: 'Shirts' })).queryByTestId('image'))
      .not.toBeInTheDocument();
  });

  it('shows the shop placeholder for categories without an image', () => {
    (useSelector as jest.Mock).mockReturnValue('https://img.example/placeholder.png');
    render(<CategoryChips categories={categories} showImages />);

    expect(within(screen.getByRole('link', { name: 'Shirts' })).getAllByTestId('image'))
      .not.toHaveLength(0);
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
