import React from 'react';
import { render, screen } from '@testing-library/react';
import { CART_MAX_ITEMS } from '@shopgate/engage/cart';
import CartButtonBadge from './index';

jest.mock('@shopgate/engage/components');
jest.mock('@shopgate/engage/core', () => ({
  useWidgetSettings: jest.fn().mockReturnValue({}),
}));
jest.mock('@shopgate/engage/cart', () => ({
  CART_MAX_ITEMS: 5,
}));

describe('<CartButtonBadge />', () => {
  it('should be null render', () => {
    const { container } = render(<CartButtonBadge count={0} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should render with number', () => {
    render(<CartButtonBadge count={1} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should render with max plus count', () => {
    render(<CartButtonBadge count={CART_MAX_ITEMS + 1} />);
    expect(screen.getByText(`${CART_MAX_ITEMS}+`)).toBeInTheDocument();
  });
});
