import { render } from '@testing-library/react';
import Empty from './index';

describe('<CartEmpty />', () => {
  it('should render', () => {
    const { container } = render(<Empty />);

    expect(container.querySelector('[data-test-id="emptyCartPlaceHolderString"]'))
      .toHaveTextContent('cart.empty');
    expect(container.querySelector('.empty-cart__image svg')).toBeInTheDocument();
    expect(container.querySelector('.empty-cart__image img')).not.toBeInTheDocument();
  });
});
