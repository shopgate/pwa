import React from 'react';
import { render, screen } from '@testing-library/react';
import RatingCount from './index';

const mockText = jest.fn(({ string }) => <span>{string}</span>);

jest.mock('@shopgate/engage/components', () => ({
  Typography: ({ children }) => children,
  I18n: {
    Text: props => mockText(props),
  },
}));

describe('<RatingCount>', () => {
  it('should render nothing when count is 0', () => {
    render(<RatingCount count={0} />);

    expect(screen.queryByText('reviews.review_count')).toBeNull();
    expect(mockText).not.toHaveBeenCalled();
  });

  it('should render text when count is more than 0', () => {
    render(<RatingCount count={1} />);

    expect(screen.getByText('reviews.review_count')).toBeTruthy();
    expect(mockText).toHaveBeenCalledWith(expect.objectContaining({
      string: 'reviews.review_count',
      params: expect.objectContaining({ count: 1 }),
    }));
  });
});
