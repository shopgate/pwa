import React from 'react';
import { render, screen } from '@shopgate/pwa-unit-test/rtlUtils';
import List from './index';

const mockTitle = jest.fn(({ title }) => <div data-testid="review-title">{title}</div>);
const mockRating = jest.fn(({ rate }) => <div data-testid="review-rating">{rate}</div>);
const mockText = jest.fn(({ review }) => <div data-testid="review-text">{review}</div>);
const mockInfo = jest.fn(({ review }) => <div data-testid="review-info">{review.date}</div>);

jest.mock('@shopgate/engage/components', () => ({
  SurroundPortals: ({ children }) => children,
}));

jest.mock('./components/Title', () => props => mockTitle(props));
jest.mock('./components/Rating', () => props => mockRating(props));
jest.mock('./components/Text', () => props => mockText(props));
jest.mock('./components/Info', () => props => mockInfo(props));

describe('<List />', () => {
  const reviews = [
    {
      id: 'a',
      author: '',
      date: '2017-09-06T12:38:51.000Z',
      rate: 100,
      title: '',
      review: 'No Name and Title Lorem ipsum dolor sit amet, con… takimata sanctus est Lorem ipsum dolor sit amet.',
    },
    {
      id: 'b',
      author: 'username123',
      date: '2017-09-06T12:37:40.000Z',
      rate: 40,
      title: 'Test review 2 ',
      review: 'Lorem ipsum dolor sit amet, consetetur sadipscing … takimata sanctus est Lorem ipsum dolor sit amet.',
    },
    {
      id: 'c',
      author: 'Carina Hoffmann',
      date: '2017-09-06T12:30:23.000Z',
      rate: 60,
      title: '',
      review: 'Test review',
    },
    {
      id: 'd',
      author: '',
      date: '2017-09-06T12:30:23.000Z',
      rate: 20,
      title: '',
      review: '',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when no reviews exist', () => {
    const { container } = render(<List reviews={[]} />);

    expect(container.firstChild).toBeNull();
    expect(screen.queryByRole('list')).toBeNull();
    expect(mockTitle).not.toHaveBeenCalled();
  });

  it('should render list with reviews', () => {
    const { container } = render(<List reviews={reviews} />);

    expect(screen.getByRole('list')).toBeTruthy();
    expect(container.querySelectorAll('li')).toHaveLength(reviews.length);

    expect(mockTitle).toHaveBeenCalledTimes(reviews.length);
    expect(mockRating).toHaveBeenCalledTimes(reviews.length);
    expect(mockText).toHaveBeenCalledTimes(reviews.length);
    expect(mockInfo).toHaveBeenCalledTimes(reviews.length);

    reviews.forEach((review, i) => {
      expect(mockTitle).toHaveBeenNthCalledWith(i + 1, expect.objectContaining({
        title: review.title,
      }));
      expect(mockRating).toHaveBeenNthCalledWith(i + 1, expect.objectContaining({
        rate: review.rate,
      }));
      expect(mockText).toHaveBeenNthCalledWith(i + 1, expect.objectContaining({
        review: review.review,
      }));
      expect(mockInfo).toHaveBeenNthCalledWith(i + 1, expect.objectContaining({
        review,
      }));
    });
  });
});
