import { useMemo, useState } from 'react';
import {
  act, fireEvent, render, screen,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProductContext } from '@shopgate/engage/product/contexts';
import AddToCartBar from './index';

let mockSettings = {
  variant: 'fixed',
  quantityPicker: false,
};
let mockStock = null;

/* eslint-disable react/prop-types */
jest.mock('react-redux', () => ({
  useSelector: selector => selector(),
}));
jest.mock('@shopgate/engage/settings/selectors/appSettings', () => ({
  getProductAddToCartBarSettings: () => mockSettings,
}));
jest.mock('@shopgate/pwa-common-commerce/product/selectors/product', () => ({
  getProductStock: () => mockStock,
}));
jest.mock('./connector', () => Component => Component);
jest.mock('@shopgate/pwa-common/context', () => ({
  RouteContext: { Consumer: ({ children }) => children({ visible: true }) },
}));
jest.mock('@shopgate/pwa-core/emitters/ui', () => ({
  addListener: jest.fn(),
  removeListener: jest.fn(),
}));
jest.mock('@shopgate/engage/components', () => ({
  FooterBar: ({ variant, children }) => <div data-testid="bar" data-variant={variant}>{children}</div>,
  SurroundPortals: ({ children }) => children,
}));
jest.mock('@shopgate/engage/product/constants', () => ({}));
jest.mock('@shopgate/engage/product/components', () => ({
  QuantityStepper: ({ value, onChange }) => (
    <button type="button" onClick={() => onChange(value + 1)}>{`quantity ${value}`}</button>
  ),
}));
jest.mock('@shopgate/engage/a11y', () => ({
  broadcastLiveMessage: jest.fn(),
  Section: ({ children }) => <section>{children}</section>,
}));
jest.mock('@shopgate/engage/locations', () => ({ DIRECT_SHIP: 'directShip' }));
jest.mock('@shopgate/engage/product/contexts', () => {
  const { createContext } = jest.requireActual('react');
  return { ProductContext: createContext({}) };
});
jest.mock('../../../../components/TabBar/hooks', () => ({
  useFooterBarLayout: variant => ({
    variant,
    gap: 16,
  }),
}));
jest.mock('./components/AddToCartButton', () => ({ state, onClick, disabled }) => (
  <button type="button" data-state={state} disabled={disabled} onClick={onClick}>add</button>
));

/* eslint-enable react/prop-types */

/**
 * Renders the bar inside a product context.
 * @param {Object} props The bar props.
 * @param {Object} context The product context value.
 * @returns {Object}
 */
const renderBar = (props, context = {}) => {
  const setQuantity = jest.fn();

  const Provider = () => {
    const [quantity, setContextQuantity] = useState(context.quantity ?? 1);
    const value = useMemo(() => ({
      ...context,
      quantity,
      setQuantity: (next) => {
        setQuantity(next);
        setContextQuantity(next);
      },
    }), [quantity]);

    return (
      <ProductContext.Provider value={value}>
        <AddToCartBar
          productId="p1"
          options={{}}
          conditioner={{ check: () => Promise.resolve(true) }}
          {...props}
        />
      </ProductContext.Provider>
    );
  };

  const utils = render(<Provider />);

  return {
    ...utils,
    setQuantity,
  };
};

describe('<AddToCartBar />', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    document.body.innerHTML = '<div id="AppFooter"></div>';
    mockSettings = {
      variant: 'fixed',
      quantityPicker: false,
    };
    mockStock = null;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('adds the quantity of the product context while the picker is off', async () => {
    const addToCart = jest.fn(() => Promise.resolve({}));
    renderBar({ addToCart }, { quantity: 4 });

    expect(screen.queryByText(/quantity/)).not.toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByText('add'));
    });

    expect(addToCart).toHaveBeenCalledWith(expect.objectContaining({
      productId: 'p1',
      quantity: 4,
    }));
  });

  it('starts at the minimum order quantity and adds the picked quantity', async () => {
    mockSettings.quantityPicker = true;
    mockStock = { minOrderQuantity: 3 };
    const addToCart = jest.fn(() => Promise.resolve({}));
    const { setQuantity } = renderBar({ addToCart });

    expect(setQuantity).toHaveBeenLastCalledWith(3);
    fireEvent.click(screen.getByText('quantity 3'));
    await act(async () => {
      fireEvent.click(screen.getByText('add'));
    });

    expect(addToCart).toHaveBeenCalledWith(expect.objectContaining({ quantity: 4 }));
  });

  it('shows the tick after success and returns to idle', async () => {
    renderBar({ addToCart: () => Promise.resolve({}) });

    await act(async () => {
      fireEvent.click(screen.getByText('add'));
    });
    expect(screen.getByText('add')).toHaveAttribute('data-state', 'added');

    act(() => {
      jest.advanceTimersByTime(1500);
    });
    expect(screen.getByText('add')).toHaveAttribute('data-state', 'idle');
  });

  it('returns to idle when the cart reports an error', async () => {
    renderBar({ addToCart: () => Promise.resolve({ messages: [{ type: 'error' }] }) });

    await act(async () => {
      fireEvent.click(screen.getByText('add'));
    });

    expect(screen.getByText('add')).toHaveAttribute('data-state', 'idle');
  });

  it('adds the product only once for two quick taps', async () => {
    const addToCart = jest.fn(() => new Promise(() => {}));
    renderBar({ addToCart });

    await act(async () => {
      fireEvent.click(screen.getByText('add'));
      fireEvent.click(screen.getByText('add'));
    });

    expect(addToCart).toHaveBeenCalledTimes(1);
  });

  it('does not add anything while the selection is incomplete', async () => {
    const addToCart = jest.fn();
    renderBar({
      addToCart,
      conditioner: { check: () => Promise.resolve(false) },
    });

    await act(async () => {
      fireEvent.click(screen.getByText('add'));
    });

    expect(addToCart).not.toHaveBeenCalled();
    expect(screen.getByText('add')).toHaveAttribute('data-state', 'idle');
  });

  it('accepts the next tap after the selection check failed with an error', async () => {
    const addToCart = jest.fn(() => Promise.resolve({}));
    const check = jest.fn()
      .mockRejectedValueOnce(new Error('check failed'))
      .mockResolvedValue(true);
    renderBar({
      addToCart,
      conditioner: { check },
    });

    await act(async () => {
      fireEvent.click(screen.getByText('add'));
    });
    expect(addToCart).not.toHaveBeenCalled();

    await act(async () => {
      fireEvent.click(screen.getByText('add'));
    });
    expect(addToCart).toHaveBeenCalledTimes(1);
  });

  it('floats when the layout says so', () => {
    mockSettings.variant = 'floating';
    renderBar({});

    expect(screen.getByTestId('bar')).toHaveAttribute('data-variant', 'floating');
  });
});
