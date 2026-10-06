import { render, screen } from '@testing-library/react';
import * as components from '@shopgate/engage/components';
import Discount from '.';

jest.mock('@shopgate/engage/components');

describe('<LiveshoppingDiscount />', () => {
  it('should render the discount badge surrounded by portals', () => {
    const portalSpy = jest.spyOn(components, 'Portal');

    render(<Discount
      discount={50}
      productId="12345"
    />);

    expect(screen.getByLabelText('cart.discount: liveshopping.discount_badge'))
      .toHaveTextContent('liveshopping.discount_badge');

    expect(portalSpy.mock.calls.map(([props]) => props)).toMatchObject([
      {
        name: 'product-item.discount.before',
        props: { productId: '12345' },
      },
      {
        name: 'product-item.discount',
        props: { productId: '12345' },
      },
      {
        name: 'product-item.discount.after',
        props: { productId: '12345' },
      },
    ]);

    portalSpy.mockRestore();
  });
});
