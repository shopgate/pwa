import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Content from './Content';

let mockPreview = {};
let mockSuggestions = [];

jest.mock('@shopgate/engage/core/helpers', () => ({
  i18n: {
    text: (key, params) => (params ? `${key}:${JSON.stringify(params)}` : key),
  },
}));
jest.mock('@shopgate/engage/components', () => ({
  SurroundPortals: ({ children }) => children,
  LoadingIndicator: () => <span>loading</span>,
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
  useSearchPreview: () => mockPreview,
  useSearchSuggestions: () => mockSuggestions,
}));

const handlers = () => ({
  onSelect: jest.fn(),
  onFilter: jest.fn(),
  onClearHistory: jest.fn(),
});

describe('<SearchOverlay /> content', () => {
  beforeEach(() => {
    mockSuggestions = [];
    mockPreview = {
      products: [],
      totalProductCount: null,
      isLoading: false,
      isPending: false,
    };
  });

  it('shows the history while the field is empty', () => {
    const props = handlers();
    render(<Content query="" history={['Jacket', 'Beanie']} {...props} />);

    fireEvent.click(screen.getByText('Beanie'));
    fireEvent.click(screen.getByText('search.history_clear'));

    expect(props.onSelect).toHaveBeenCalledWith('Beanie');
    expect(props.onClearHistory).toHaveBeenCalled();
  });

  it('filters the history below the minimum length', () => {
    render(<Content query="ja" history={['Jacket', 'Beanie']} {...handlers()} />);

    expect(screen.getByText('Jacket')).toBeInTheDocument();
    expect(screen.queryByText('Beanie')).not.toBeInTheDocument();
    expect(screen.queryByText('search.history_clear')).not.toBeInTheDocument();
  });

  it('shows suggestions, count, filter shortcut and the first products', () => {
    mockSuggestions = ['beanie black'];
    mockPreview = {
      products: [{
        id: 'p1',
        name: 'Crew Beanie',
      }],
      totalProductCount: 17,
      isLoading: false,
      isPending: false,
    };
    const props = handlers();
    render(<Content query="bean" history={[]} {...props} />);

    expect(screen.getByText('Crew Beanie')).toBeInTheDocument();
    expect(screen.getByText('search.results_count:{"count":17}')).toBeInTheDocument();

    const chip = screen.getByText('bean');
    expect(chip.parentElement).toHaveTextContent('beanie black');
    fireEvent.click(chip.parentElement);
    fireEvent.click(screen.getByText('titles.filter'));
    fireEvent.click(screen.getByText('search.show_all_results'));

    expect(props.onSelect).toHaveBeenCalledWith('beanie black');
    expect(props.onFilter).toHaveBeenCalledWith('bean');
    expect(props.onSelect).toHaveBeenCalledWith('bean');
  });

  it('shows a loader instead of an outdated count while the next search loads', () => {
    mockPreview = {
      products: [{
        id: 'p1',
        name: 'Crew Beanie',
      }],
      totalProductCount: 17,
      isLoading: true,
      isPending: false,
    };
    render(<Content query="jack" history={[]} {...handlers()} />);

    expect(screen.getByText('progress')).toBeInTheDocument();
    expect(screen.queryByText(/search.results_count/)).not.toBeInTheDocument();
  });

  it('tells when nothing was found', () => {
    mockPreview = {
      products: [],
      totalProductCount: 0,
      isLoading: false,
      isPending: false,
    };
    render(<Content query="xyz" history={[]} {...handlers()} />);

    expect(screen.getByText('search.no_result.body:{"searchPhrase":"xyz"}')).toBeInTheDocument();
  });
});
