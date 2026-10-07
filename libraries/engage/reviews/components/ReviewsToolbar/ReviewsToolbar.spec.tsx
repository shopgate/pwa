import {
  act, render, screen, fireEvent,
} from '@testing-library/react';
import ReviewsToolbar from './ReviewsToolbar';
import type { ReviewsToolbarProps } from './ReviewsToolbar';

const defaultProps: ReviewsToolbarProps = {
  sort: 'dateDesc',
  sortOptions: ['dateDesc', 'rateDesc', 'rateAsc'],
  filterMedia: false,
  isMediaFilterAvailable: true,
  onSortChange: jest.fn(),
  onFilterMediaChange: jest.fn(),
};

/**
 * @param props Props that differ from the defaults.
 * @returns The render result and the change handlers.
 */
const renderToolbar = (props: Partial<ReviewsToolbarProps> = {}) => {
  const onSortChange = jest.fn();
  const onFilterMediaChange = jest.fn();
  const result = render(
    <ReviewsToolbar
      {...defaultProps}
      onSortChange={onSortChange}
      onFilterMediaChange={onFilterMediaChange}
      {...props}
    />
  );

  return {
    ...result,
    onSortChange,
    onFilterMediaChange,
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

  it('should render nothing without sort options and media filter', () => {
    const { container } = renderToolbar({
      sortOptions: ['dateDesc'],
      isMediaFilterAvailable: false,
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

  it('should hide the sort select with fewer than two options and keep the filter', () => {
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
    rerender(<ReviewsToolbar {...defaultProps} filterMedia onSortChange={latestHandler} />);
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

  it('should hide the media filter when the provider does not support it', () => {
    renderToolbar({ isMediaFilterAvailable: false });

    expect(screen.queryByRole('button', { name: 'reviews.filter_media' })).not.toBeInTheDocument();
    expect(getSortButton()).toBeInTheDocument();
  });

  it('should toggle the media filter', () => {
    const { onFilterMediaChange, rerender } = renderToolbar();
    const chip = screen.getByRole('button', { name: 'reviews.filter_media' });

    expect(chip).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(chip);
    expect(onFilterMediaChange).toHaveBeenCalledWith(true);

    rerender(
      <ReviewsToolbar {...defaultProps} filterMedia onFilterMediaChange={onFilterMediaChange} />
    );

    expect(chip).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(chip);
    expect(onFilterMediaChange).toHaveBeenLastCalledWith(false);
  });
});
