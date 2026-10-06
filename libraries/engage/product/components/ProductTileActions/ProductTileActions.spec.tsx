import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductTileActions from './ProductTileActions';

let mockActionButtons: Record<string, unknown> = {};

jest.mock('react-redux', () => ({
  useSelector: () => mockActionButtons,
}));
jest.mock('../ProductGrid/components/Item/components/ItemFavoritesButton', () => () => (
  <button type="button">favorite</button>
));
jest.mock('../ProductCardAddToCart', () => ({
  ProductCardAddToCart: () => <button type="button">cart</button>,
}));

describe('<ProductTileActions />', () => {
  it('exposes position and direction and renders only the favorites button by default', () => {
    mockActionButtons = {
      position: 'bottomRight',
      direction: 'horizontal',
      addToCart: 'hidden',
    };
    const { container } = render(<ProductTileActions productId="p1" />);

    const root = container.firstChild as HTMLElement;
    expect(root).toHaveAttribute('data-position', 'bottomRight');
    expect(root).toHaveAttribute('data-direction', 'horizontal');
    expect(screen.getByRole('button', { name: 'favorite' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'cart' })).not.toBeInTheDocument();
  });

  it('adds the cart action button before the favorites button', () => {
    mockActionButtons = {
      position: 'topRight',
      direction: 'vertical',
      addToCart: 'actionButton',
    };
    render(<ProductTileActions productId="p1" />);

    expect(screen.getAllByRole('button').map(button => button.textContent))
      .toEqual(['cart', 'favorite']);
  });

  it('leaves the button below the tile to the tile', () => {
    mockActionButtons = {
      position: 'topRight',
      direction: 'vertical',
      addToCart: 'button',
    };
    render(<ProductTileActions productId="p1" />);

    expect(screen.queryByRole('button', { name: 'cart' })).not.toBeInTheDocument();
  });
});
