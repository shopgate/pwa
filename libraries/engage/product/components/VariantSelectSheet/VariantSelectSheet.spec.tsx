import { type ReactNode } from 'react';
import {
  act, fireEvent, render, screen,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import VariantSelectSheet from './VariantSelectSheet';
import type { VariantSelectorProps } from '../VariantSelector';

const products: Record<string, unknown> = {
  base: {
    id: 'base',
    name: 'Jacket',
    price: {
      currency: 'EUR',
      unitPrice: 210,
      msrp: 315,
    },
  },
};
const variants = {
  characteristics: [{
    id: 'color',
    label: 'Color',
    values: [{
      id: 'gold',
      label: 'Gold',
    }],
  }],
  products: [{
    id: 'gold-1',
    characteristics: { color: 'gold' },
    stock: { orderable: true },
  }],
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
jest.mock('@shopgate/engage/core/helpers', () => ({ i18n: { text: (key: string) => key } }));
jest.mock('@shopgate/engage/components', () => ({
  Price: ({ unitPrice }: { unitPrice: number }) => <span>{`price ${unitPrice}`}</span>,
  PriceStriked: ({ value }: { value: number }) => <span>{`striked ${value}`}</span>,
  SheetDrawer: ({ isOpen, children }: { isOpen: boolean; children: ReactNode }) => (
    isOpen ? <div>{children}</div> : null
  ),
  SurroundPortals: ({ portalName, children }: { portalName: string; children: ReactNode }) => (
    <div data-portal={portalName}>{children}</div>
  ),
}));
jest.mock('@shopgate/engage/components/v2', () => ({
  Button: ({ children, disabled, onClick }: {
    children: ReactNode;
    disabled: boolean;
    onClick: () => void;
  }) => <button type="button" disabled={disabled} onClick={onClick}>{children}</button>,
}));
jest.mock('../ProductImage', () => () => null);
let mockSelected = false;

jest.mock('../VariantSelector', () => ({
  VariantSelector: ({ onCharacteristicsChange, compact, conditioner }: VariantSelectorProps) => {
    conditioner?.addConditioner('variants', () => mockSelected);

    return (
      <button
        type="button"
        data-compact={compact ? 'true' : undefined}
        onClick={() => {
          mockSelected = true;
          onCharacteristicsChange?.({ color: 'gold' });
        }}
      >
        select gold
      </button>
    );
  },
}));

describe('<VariantSelectSheet />', () => {
  beforeEach(() => {
    mockSelected = false;
  });

  it('checks the selection first and passes the selected variant once', async () => {
    const onAddToCart = jest.fn();
    render(<VariantSelectSheet productId="base" isOpen onClose={jest.fn()} onAddToCart={onAddToCart} />);

    expect(screen.getByText('Jacket')).toBeInTheDocument();
    expect(screen.getByText('Jacket').closest('[data-portal]'))
      .toHaveAttribute('data-portal', 'product.variant-select-sheet');
    expect(screen.getByText('striked 315')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'select gold' })).toHaveAttribute('data-compact', 'true');

    const addButton = screen.getByRole('button', { name: 'product.add_to_cart' });
    expect(addButton).toBeEnabled();

    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    await act(async () => {
      fireEvent.click(addButton);
    });
    expect(onAddToCart).not.toHaveBeenCalled();
    warn.mockRestore();

    fireEvent.click(screen.getByRole('button', { name: 'select gold' }));
    await act(async () => {
      fireEvent.click(addButton);
      fireEvent.click(addButton);
    });

    expect(onAddToCart).toHaveBeenCalledTimes(1);
    expect(onAddToCart).toHaveBeenCalledWith(expect.objectContaining({ id: 'gold-1' }));
  });

  it('renders nothing while closed', () => {
    const { container } = render(
      <VariantSelectSheet productId="base" isOpen={false} onClose={jest.fn()} onAddToCart={jest.fn()} />
    );

    expect(container).toBeEmptyDOMElement();
  });
});
