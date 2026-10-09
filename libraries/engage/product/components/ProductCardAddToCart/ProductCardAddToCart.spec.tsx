import { type ReactNode } from 'react';
import {
  act, fireEvent, render, screen,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { addProductsToCart } from '@shopgate/engage/cart';
import ProductCardAddToCart from './ProductCardAddToCart';

let mockProduct: unknown = null;
let mockAddResult: Promise<unknown> = Promise.resolve({});
const mockDispatch = jest.fn(action => (action === 'ADD' ? mockAddResult : action));

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector: (state: unknown) => unknown) => selector({}),
  useStore: () => ({ getState: () => ({}) }),
}));
jest.mock('@shopgate/pwa-common-commerce/product/selectors/product', () => ({
  getProduct: () => mockProduct,
}));
jest.mock('@shopgate/engage/cart', () => ({ addProductsToCart: jest.fn(() => 'ADD') }));
const mockPush = jest.fn();

jest.mock('@shopgate/engage/core/hooks', () => ({
  useNavigation: () => ({ push: mockPush }),
}));
jest.mock('@shopgate/engage/product/helpers', () => ({
  getProductRoute: (id: string) => `/item/${id}`,
}));
jest.mock('@shopgate/engage/core/helpers', () => ({
  hasNewServices: () => false,
  i18n: { text: (key: string) => key },
}));
jest.mock('@shopgate/engage/locations/selectors', () => ({
  getPreferredFulfillmentMethod: () => null,
  getPreferredLocation: () => null,
}));
jest.mock('@shopgate/engage/locations/constants', () => ({ DIRECT_SHIP: 'directShip' }));
jest.mock('@shopgate/engage/a11y/helpers', () => ({ broadcastLiveMessage: jest.fn() }));
jest.mock('@shopgate/engage/components', () => ({
  CartIcon: () => null,
  SurroundPortals: ({ portalName, children }: { portalName: string; children: ReactNode }) => (
    <div data-portal={portalName}>{children}</div>
  ),
}));
jest.mock('@shopgate/pwa-ui-shared/icons/TickIcon', () => () => <span>tick</span>);
jest.mock('@shopgate/engage/components/v2', () => ({
  CircularProgress: () => <span>loading</span>,
  IconButton: ({
    onClick, disabled, children, 'aria-busy': busy,
  }: {
    onClick: (event: unknown) => unknown;
    disabled: boolean;
    children: ReactNode;
    'aria-busy'?: boolean;
  }) => (
    <button type="button" disabled={disabled} aria-busy={busy} onClick={onClick}>
      add
      {children}
    </button>
  ),
  Button: ({
    onClick, disabled, variant, children, 'aria-busy': busy,
  }: {
    onClick: (event: unknown) => unknown;
    disabled: boolean;
    variant: string;
    children: ReactNode;
    'aria-busy'?: boolean;
  }) => (
    <button
      type="button"
      disabled={disabled}
      aria-busy={busy}
      data-variant={variant}
      onClick={onClick}
    >
      {children}
    </button>
  ),
}));
jest.mock('../VariantSelectSheet', () => ({
  VariantSelectSheet: ({ isOpen, onAddToCart }: {
    isOpen: boolean;
    onAddToCart: (variant: { id: string }) => unknown;
  }) => (isOpen ? (
    <button type="button" onClick={() => onAddToCart({ id: 'variant-1' })}>sheet</button>
  ) : null),
}));

describe('<ProductCardAddToCart />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAddResult = Promise.resolve({});
  });

  it('adds a simple product directly', async () => {
    mockProduct = {
      id: 'simple',
      flags: {},
      stock: { orderable: true },
    };
    render(<ProductCardAddToCart productId="simple" />);

    expect(screen.getByRole('button', { name: 'add' }).closest('[data-portal]'))
      .toHaveAttribute('data-portal', 'product-item.add-to-cart');

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'add' }));
    });

    expect(addProductsToCart).toHaveBeenCalledWith([{
      productId: 'simple',
      quantity: 1,
    }]);
  });

  it('opens the variant sheet for variant products and adds the selected variant', async () => {
    mockProduct = {
      id: 'base',
      flags: { hasVariants: true },
    };
    render(<ProductCardAddToCart productId="base" />);

    fireEvent.click(screen.getByRole('button', { name: 'add' }));
    expect(addProductsToCart).not.toHaveBeenCalled();

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'sheet' }));
    });
    expect(addProductsToCart).toHaveBeenCalledWith([{
      productId: 'variant-1',
      quantity: 1,
    }]);
  });

  it('leads to the product page for products with options', () => {
    mockProduct = {
      id: 'options',
      flags: { hasOptions: true },
    };
    render(<ProductCardAddToCart productId="options" />);

    fireEvent.click(screen.getByRole('button', { name: 'add' }));

    expect(mockPush).toHaveBeenCalledWith({ pathname: '/item/options' });
    expect(addProductsToCart).not.toHaveBeenCalled();
  });

  it('disables the button for products that are not orderable', () => {
    mockProduct = {
      id: 'soldout',
      flags: {},
      stock: { orderable: false },
    };
    render(<ProductCardAddToCart productId="soldout" />);

    expect(screen.getByRole('button', { name: 'add' })).toBeDisabled();
  });

  it('shows the tick only after the product was added', async () => {
    let resolve: (value: unknown) => void = jest.fn();
    mockAddResult = new Promise((done) => { resolve = done; });
    mockProduct = {
      id: 'simple',
      flags: {},
      stock: { orderable: true },
    };
    render(<ProductCardAddToCart productId="simple" variant="button" />);

    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeEnabled();
    expect(screen.queryByText('tick')).not.toBeInTheDocument();

    await act(async () => {
      resolve({});
    });

    expect(button).not.toHaveAttribute('aria-busy');
    expect(button).toHaveAttribute('data-variant', 'contained');
    expect(screen.getByText('tick')).toBeInTheDocument();
  });

  it('returns to the initial state when adding fails', async () => {
    mockAddResult = Promise.reject(new Error('failed'));
    mockAddResult.catch(jest.fn());
    mockProduct = {
      id: 'simple',
      flags: {},
      stock: { orderable: true },
    };
    render(<ProductCardAddToCart productId="simple" variant="button" />);

    const button = screen.getByRole('button');
    await act(async () => {
      fireEvent.click(button);
    });

    expect(button).toHaveAttribute('data-variant', 'outlined');
    expect(screen.queryByText('tick')).not.toBeInTheDocument();
  });

  it('ignores clicks while the product is being added', () => {
    mockAddResult = new Promise(jest.fn());
    mockProduct = {
      id: 'simple',
      flags: {},
      stock: { orderable: true },
    };
    render(<ProductCardAddToCart productId="simple" />);

    const button = screen.getByRole('button', { name: /add/ });
    fireEvent.click(button);
    fireEvent.click(button);

    expect(addProductsToCart).toHaveBeenCalledTimes(1);
  });
});
