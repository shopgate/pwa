import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RatingStars from './index';

jest.mock('../icons/StarIcon', () => () => <i data-testid="star" />);
jest.mock('../icons/StarHalfIcon', () => () => <i data-testid="half-star" />);

const numEmptyStars = 5;

describe('<RatingStars />', () => {
  it('renders with value of 50', () => {
    const { container } = render(<RatingStars value={50} />);

    expect(screen.getByRole('img', { name: 'reviews.rating_stars' }))
      .toHaveAttribute('data-test-id', 'ratedStars: 2.5');
    expect(screen.getAllByTestId('star')).toHaveLength(numEmptyStars + 2);
    expect(screen.getAllByTestId('half-star')).toHaveLength(1);
    expect(container.querySelectorAll('.rating-stars-empty [data-testid="star"]'))
      .toHaveLength(numEmptyStars);
    expect(container.querySelectorAll('.rating-stars-filled > [aria-hidden="true"]'))
      .toHaveLength(2);
  });

  it('renders with value of 0', () => {
    const { container } = render(<RatingStars value={0} />);

    expect(screen.getByRole('img', { name: 'reviews.rating_stars' }))
      .toHaveAttribute('data-test-id', 'ratedStars: 0');
    expect(screen.getAllByTestId('star')).toHaveLength(numEmptyStars);
    expect(screen.queryByTestId('half-star')).not.toBeInTheDocument();
    expect(container.querySelectorAll('.rating-stars-filled > [aria-hidden="true"]'))
      .toHaveLength(5);
  });

  it('renders with value of 100', () => {
    const { container } = render(<RatingStars value={100} />);

    expect(screen.getByRole('img', { name: 'reviews.rating_stars' }))
      .toHaveAttribute('data-test-id', 'ratedStars: 5');
    expect(screen.getAllByTestId('star')).toHaveLength(numEmptyStars + 5);
    expect(screen.queryByTestId('half-star')).not.toBeInTheDocument();
    expect(container.querySelectorAll('.rating-stars-filled > [aria-hidden="true"]'))
      .toHaveLength(0);
  });

  it('should change rating on click', () => {
    const { rerender } = render(<RatingStars value={100} isSelectable />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'reviews.press_to_rate_with_x_stars' }))
      .toHaveLength(numEmptyStars);
    expect(screen.getAllByTestId('star')).toHaveLength(10);

    rerender(<RatingStars value={20} isSelectable />);
    expect(screen.getAllByTestId('star')).toHaveLength(6);

    rerender(<RatingStars value={70} isSelectable />);
    expect(screen.getAllByTestId('star')).toHaveLength(8);
    expect(screen.getAllByTestId('half-star')).toHaveLength(1);
    expect(screen.getAllByRole('button', { name: 'reviews.press_to_rate_with_x_stars' }))
      .toHaveLength(numEmptyStars);
  });

  it('should call onSelection with the clicked rating in selectable mode', () => {
    const selections = [];

    const SelectableRatingStars = () => {
      const [value, setValue] = useState(20);

      return (
        <RatingStars
          value={value}
          isSelectable
          onSelection={(e) => {
            selections.push(e.target.value);
            setValue(e.target.value);
          }}
        />
      );
    };

    render(<SelectableRatingStars />);

    expect(screen.getAllByRole('button')).toHaveLength(numEmptyStars);

    fireEvent.click(screen.getAllByRole('button')[4]);
    expect(selections).toEqual([100]);
    expect(screen.getAllByTestId('star')).toHaveLength(numEmptyStars + 5);

    expect(screen.getAllByRole('button')).toHaveLength(numEmptyStars);
    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(selections).toEqual([100, 20]);
    expect(screen.getAllByTestId('star')).toHaveLength(numEmptyStars + 1);
  });

  it('should NOT call onSelection callback when component is NOT selectable', () => {
    const spy = jest.fn();
    render(<RatingStars value={100} onSelection={spy} />);

    fireEvent.click(screen.getAllByTestId('star')[5].parentElement);
    fireEvent.click(screen.getAllByTestId('star')[0].parentElement);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(spy).not.toHaveBeenCalled();
  });
});
