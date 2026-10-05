import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import VariantSelectSheet from './VariantSelectSheet';
import type { VariantSelectorProps } from '../VariantSelector';

const products: Record<string, unknown> = {
  base: { id: 'base', name: 'Jacket', price: { currency: 'EUR', unitPrice: 210, msrp: 315 } },
};
const variants = {
  characteristics: [{ id: 'color', label: 'Color', values: [{ id: 'gold', label: 'Gold' }] }],
  products: [{ id: 'gold-1', characteristics: { color: 'gold' }, stock: { orderable: true } }],
};

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: (selector: (state: unknown) => unknown) => selector({}),
}));
jest.mock('@shopgate/pwa-common-commerce/product/selectors/product', () => ({
  getProduct: (_: unknown, { productId }: { productId: string }) => products[productId] ?? null,
  getProductVariants: () => variants,
}));
jest.mock('@shopgate/pwa-common-commerce/product/actions/fetchProduct', () => jest.fn());
jest.mock('@shopgate/pwa-common-commerce/product/actions/fetchProductVariants', () => jest.fn());
jest.mock('@shopgate/engage/core/helpers/i18n', () => ({ i18n: { text: (key: string) => key } }));
jest.mock('@shopgate/engage/components', () => ({
  SheetDrawer: ({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) => (
    isOpen ? <div>{children}</div> : null
  ),
}));
jest.mock('@shopgate/engage/components/v2', () => ({
  Button: ({ children, disabled, onClick }: {
    children: React.ReactNode;
    disabled: boolean;
    onClick: () => void;
  }) => <button type="button" disabled={disabled} onClick={onClick}>{children}</button>,
}));
jest.mock('@shopgate/pwa-ui-shared/Price', () => ({ unitPrice }: { unitPrice: number }) => (
  <span>{`price ${unitPrice}`}</span>
));
jest.mock('@shopgate/pwa-ui-shared/PriceStriked', () => ({ value }: { value: number }) => (
  <span>{`striked ${value}`}</span>
));
jest.mock('../ProductImage', () => () => null);
jest.mock('../VariantSelector', () => ({
  VariantSelector: ({ onCharacteristicsChange, compact }: VariantSelectorProps) => (
    <button
      type="button"
      data-compact={compact ? 'true' : undefined}
      onClick={() => onCharacteristicsChange?.({ color: 'gold' })}
    >
      select gold
    </button>
  ),
}));

describe('<VariantSelectSheet />', () => {
  it('enables add to cart once a variant is selected and passes the variant', () => {
    const onAddToCart = jest.fn();
    render(<VariantSelectSheet productId="base" isOpen onClose={jest.fn()} onAddToCart={onAddToCart} />);

    expect(screen.getByText('Jacket')).toBeInTheDocument();
    expect(screen.getByText('striked 315')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'select gold' })).toHaveAttribute('data-compact', 'true');

    const addButton = screen.getByRole('button', { name: 'product.add_to_cart' });
    expect(addButton).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: 'select gold' }));
    fireEvent.click(addButton);

    expect(onAddToCart).toHaveBeenCalledWith(expect.objectContaining({ id: 'gold-1' }));
  });

  it('renders nothing while closed', () => {
    const { container } = render(
      <VariantSelectSheet productId="base" isOpen={false} onClose={jest.fn()} onAddToCart={jest.fn()} />
    );

    expect(container).toBeEmptyDOMElement();
  });
});
