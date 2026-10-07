import {
  act, render, screen, fireEvent,
} from '@testing-library/react';
import ReviewsToolbar from './ReviewsToolbar';
import type { ReviewsToolbarProps } from './ReviewsToolbar';

const defaultProps: ReviewsToolbarProps = {
  sort: 'dateDesc',
  sortOptions: ['dateDesc', 'rateDesc', 'rateAsc'],
  filters: {},
  filterOptions: [
    {
      param: 'filterMedia',
      label: 'reviews.filter_media',
    },
    {
      param: 'filterVerified',
      label: 'reviews.filter_verified',
    },
  ],
  onSortChange: jest.fn(),
  onFilterChange: jest.fn(),
};

/**
 * @param props Props that differ from the defaults.
 * @returns The render result and the change handlers.
 */
const renderToolbar = (props: Partial<ReviewsToolbarProps> = {}) => {
  const onSortChange = jest.fn();
  const onFilterChange = jest.fn();
  const result = render(
    <ReviewsToolbar
      {...defaultProps}
      onSortChange={onSortChange}
      onFilterChange={onFilterChange}
      {...props}
    />
  );

  return {
    ...result,
    onSortChange,
    onFilterChange,
  };
};

/**
 * @returns The button that shows the current sort and opens the options.
 */
const getSortButton = () => screen.getByRole('button', { name: /reviews\.sort_/ });

describe('<ReviewsToolbar />', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render nothing without sort options and filters', () => {
    const { container } = renderToolbar({
      sortOptions: ['dateDesc'],
      filterOptions: [],
    });

    expect(container).toBeEmptyDOMElement();
  });

  it('should show the current sort and offer the provider options in their order', () => {
    renderToolbar({ sort: 'rateDesc' });

    expect(getSortButton()).toHaveTextContent('reviews.sort_rateDesc');
    expect(screen.getAllByRole('menuitem', { hidden: true }).map(item => item.textContent)).toEqual([
      'reviews.sort_dateDesc',
      'reviews.sort_rateDesc',
      'reviews.sort_rateAsc',
    ]);
  });

  it('should hide the sort select with fewer than two options and keep the filters', () => {
    renderToolbar({ sortOptions: ['dateDesc'] });

    expect(screen.queryByRole('menuitem', { hidden: true })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'reviews.filter_media' })).toBeInTheDocument();
  });

  it('should list the current sort first when the provider does not report it', () => {
    renderToolbar({ sortOptions: ['rateDesc', 'rateAsc'] });

    expect(getSortButton()).toHaveTextContent('reviews.sort_dateDesc');
    expect(screen.getAllByRole('menuitem', { hidden: true }).map(item => item.textContent)).toEqual([
      'reviews.sort_dateDesc',
      'reviews.sort_rateDesc',
      'reviews.sort_rateAsc',
    ]);
  });

  it('should report the selected sort', () => {
    const { onSortChange } = renderToolbar();

    fireEvent.click(getSortButton());
    fireEvent.click(screen.getByRole('menuitem', {
      hidden: true,
      name: 'reviews.sort_rateAsc',
    }));
    act(() => {
      jest.runAllTimers();
    });

    expect(onSortChange).toHaveBeenCalledWith('rateAsc');
  });

  it('should report the selection to the handler that is current when the list has closed', () => {
    const { rerender } = renderToolbar();
    const latestHandler = jest.fn();

    fireEvent.click(getSortButton());
    fireEvent.click(screen.getByRole('menuitem', {
      hidden: true,
      name: 'reviews.sort_rateAsc',
    }));
    rerender(
      <ReviewsToolbar
        {...defaultProps}
        filters={{ filterMedia: true }}
        onSortChange={latestHandler}
      />
    );
    act(() => {
      jest.runAllTimers();
    });

    expect(latestHandler).toHaveBeenCalledWith('rateAsc');
  });

  it('should follow a sort that changes from outside', () => {
    const { rerender } = renderToolbar({ sort: 'rateDesc' });

    rerender(<ReviewsToolbar {...defaultProps} sort="dateDesc" />);

    expect(getSortButton()).toHaveTextContent('reviews.sort_dateDesc');
  });

  it('should offer only the filters the provider supports', () => {
    renderToolbar({ filterOptions: [defaultProps.filterOptions[1]] });

    expect(screen.queryByRole('button', { name: 'reviews.filter_media' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'reviews.filter_verified' })).toBeInTheDocument();
    expect(getSortButton()).toBeInTheDocument();
  });

  it('should mark the active filters and report a toggled filter with its new state', () => {
    const { onFilterChange } = renderToolbar({ filters: { filterVerified: true } });
    const media = screen.getByRole('button', { name: 'reviews.filter_media' });
    const verified = screen.getByRole('button', { name: 'reviews.filter_verified' });

    expect(media).toHaveAttribute('aria-pressed', 'false');
    expect(verified).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(media);
    expect(onFilterChange).toHaveBeenLastCalledWith('filterMedia', true);

    fireEvent.click(verified);
    expect(onFilterChange).toHaveBeenLastCalledWith('filterVerified', false);
  });
});
