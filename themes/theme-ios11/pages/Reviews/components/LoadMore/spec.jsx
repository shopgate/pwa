import { render, screen, fireEvent } from '@testing-library/react';
import LoadMore from './index';

jest.mock('./connector', () => Component => Component);

describe('LoadMore', () => {
  it('should render button when reviews number is lower than total reviews count', () => {
    render(<LoadMore
      currentReviewCount={2}
      fetchReviews={() => {}}
      productId="foo"
      totalReviewCount={4}
    />);
    expect(screen.getByRole('button', { name: 'common.load_more' })).toBeInTheDocument();
  });
  it('should render nothing when reviews number is same as total reviews count', () => {
    const { container } = render(<LoadMore
      currentReviewCount={2}
      fetchReviews={() => {}}
      productId="foo"
      totalReviewCount={2}
    />);
    expect(container).toBeEmptyDOMElement();
  });
  it('should render nothing when reviews number is higher than total reviews count', () => {
    const { container } = render(<LoadMore
      currentReviewCount={3}
      fetchReviews={() => {}}
      productId="foo"
      totalReviewCount={2}
    />);
    expect(container).toBeEmptyDOMElement();
  });
  it('should render nothing when productId is not passed', () => {
    const { container } = render(<LoadMore
      currentReviewCount={1}
      fetchReviews={() => {}}
      totalReviewCount={2}
    />);
    expect(container).toBeEmptyDOMElement();
  });
  it('should call fetchReviews on click', () => {
    const fetchReviewsMock = jest.fn();
    render(<LoadMore
      currentReviewCount={1}
      fetchReviews={fetchReviewsMock}
      productId="foo"
      totalReviewCount={2}
    />);
    fireEvent.click(screen.getByRole('button', { name: 'common.load_more' }));
    expect(screen.getByRole('button', { name: 'common.load_more' })).toBeInTheDocument();
    expect(fetchReviewsMock).toHaveBeenCalled();
  });
});
