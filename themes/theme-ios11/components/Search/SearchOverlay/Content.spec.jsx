import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Content from './Content';

let mockSuggestions = [];

jest.mock('@shopgate/engage/core/helpers', () => ({
  i18n: {
    text: (key, params) => (params ? `${key}:${JSON.stringify(params)}` : key),
  },
}));
jest.mock('@shopgate/engage/components', () => ({
  /* eslint-disable react/prop-types */
  SurroundPortals: ({ children }) => children,
  Typography: ({ children, role }) => <span role={role}>{children}</span>,
  NoResults: ({ searchPhrase }) => <span>{`no results for ${searchPhrase}`}</span>,
  /* eslint-enable react/prop-types */
}));
jest.mock('@shopgate/engage/components/v2', () => ({
  // eslint-disable-next-line react/prop-types
  Button: ({ children, onClick }) => <button type="button" onClick={onClick}>{children}</button>,
  CircularProgress: () => <span>progress</span>,
}));
jest.mock('@shopgate/engage/product/components', () => ({
  /* eslint-disable-next-line react/prop-types */
  ProductGrid: ({ products }) => (
    // eslint-disable-next-line react/prop-types
    <ul>{products.map(product => <li key={product.id}>{product.name}</li>)}</ul>
  ),
}));
jest.mock('../hooks', () => ({
  useSearchSuggestions: () => mockSuggestions,
}));

const EMPTY = {
  products: [],
  totalProductCount: null,
  isLoading: false,
};

const handlers = () => ({
  onSelect: jest.fn(),
  onFilter: jest.fn(),
  onClearHistory: jest.fn(),
});

describe('<SearchOverlay /> content', () => {
  beforeEach(() => {
    mockSuggestions = [];
  });

  it('shows the history while the field is empty', () => {
    const props = handlers();
    render(<Content query="" searchPhrase="" preview={EMPTY} history={['Jacket', 'Beanie']} {...props} />);

    fireEvent.click(screen.getByText('Beanie'));
    fireEvent.click(screen.getByRole('button', { name: 'search.history_clear' }));

    expect(props.onSelect).toHaveBeenCalledWith('Beanie');
    expect(props.onClearHistory).toHaveBeenCalled();
  });

  it('filters the history below the minimum length', () => {
    render(<Content query="ja" searchPhrase="ja" preview={EMPTY} history={['Jacket', 'Beanie']} {...handlers()} />);

    expect(screen.getByText('Jacket')).toBeInTheDocument();
    expect(screen.queryByText('Beanie')).not.toBeInTheDocument();
    expect(screen.queryByText('search.history_clear')).not.toBeInTheDocument();
  });

  it('shows suggestions, count, filter shortcut and the first products', () => {
    mockSuggestions = ['beanie black'];
    const preview = {
      products: [{
        id: 'p1',
        name: 'Crew Beanie',
      }],
      totalProductCount: 17,
      isLoading: false,
    };
    const props = handlers();
    render(<Content query="bean" searchPhrase="bean" preview={preview} history={[]} {...props} />);

    expect(screen.getByText('Crew Beanie')).toBeInTheDocument();
    expect(screen.getAllByText('search.results_count:{"count":17}')).toHaveLength(2);

    const chip = screen.getByText('bean');
    expect(chip.parentElement).toHaveTextContent('beanie black');
    fireEvent.click(chip.parentElement);
    fireEvent.click(screen.getByText('titles.filter'));
    fireEvent.click(screen.getByText('search.show_all_results'));

    expect(props.onSelect).toHaveBeenCalledWith('beanie black');
    expect(props.onFilter).toHaveBeenCalledWith('bean');
    expect(props.onSelect).toHaveBeenCalledWith('bean');
  });

  it('dims the previous products while the next search is still typed', () => {
    const preview = {
      products: [{
        id: 'p1',
        name: 'Crew Beanie',
      }],
      totalProductCount: 17,
      isLoading: false,
    };
    const { container } = render(
      <Content query="jacke" searchPhrase="jack" preview={preview} history={[]} {...handlers()} />
    );

    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument();
  });

  it('tells when nothing was found', () => {
    const preview = {
      products: [],
      totalProductCount: 0,
      isLoading: false,
    };
    render(<Content query="xyz" searchPhrase="xyz" preview={preview} history={[]} {...handlers()} />);

    expect(screen.getByText('no results for xyz')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('search.no_result.body:{"searchPhrase":"xyz"}');
  });

  it('announces the number of results once the search settled', () => {
    const preview = {
      products: [{
        id: '1',
        name: 'Jacket',
      }],
      totalProductCount: 17,
      isLoading: true,
    };
    const { rerender } = render(
      <Content query="jack" searchPhrase="jack" preview={preview} history={[]} {...handlers()} />
    );
    expect(screen.getByRole('status')).toBeEmptyDOMElement();

    rerender(
      <Content
        query="jack"
        searchPhrase="jack"
        preview={{
          ...preview,
          isLoading: false,
        }}
        history={[]}
        {...handlers()}
      />
    );

    expect(screen.getByRole('status')).toHaveTextContent('search.results_count:{"count":17}');
  });
});
