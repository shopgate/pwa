import { render, screen } from '@testing-library/react';
import AllReviewsLink from './index';

jest.mock('./connector', () => component => component);

describe('<AllReviewsLink />', () => {
  it('should render nothing up to the preview count', () => {
    const { container } = render(<AllReviewsLink productId="foo" count={2} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('should render a text button by default', () => {
    const { container } = render(<AllReviewsLink productId="foo" count={7} />);

    const wrapper = container.querySelector('.engage__reviews__all-reviews-link');
    expect(wrapper).toHaveAttribute('data-test-id', 'showAllReviewsButton');
    expect(wrapper).not.toHaveAttribute('data-full-width');
    expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'text');
  });

  it('should render a full width outlined button', () => {
    const { container } = render(<AllReviewsLink productId="foo" count={7} fullWidth />);

    expect(container.querySelector('.engage__reviews__all-reviews-link'))
      .toHaveAttribute('data-full-width', 'true');
    expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'outlined');
  });
});
