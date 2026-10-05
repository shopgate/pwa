import React from 'react';
import {
  act, fireEvent, render, screen,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  getProductVariants,
  getProductVariantsState,
  hasProductVariants,
} from '@shopgate/pwa-common-commerce/product/selectors/product';
import VariantSelector from './VariantSelector';
import { registerVariantRenderer } from './registry';
import type { ProductVariants, VariantRendererProps } from './types';

jest.mock('react-redux', () => ({
  useSelector: (selector: (state: unknown) => unknown) => selector({}),
}));
jest.mock('@shopgate/pwa-common-commerce/product/selectors/product', () => ({
  getProductVariants: jest.fn(),
  hasProductVariants: jest.fn(),
  getBaseProductId: () => 'base',
  getProductVariantsState: jest.fn(() => ({})),
}));
jest.mock('@shopgate/engage/core/helpers', () => ({ isBeta: () => false }));
jest.mock('@shopgate/engage/components', () => ({
  Portal: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock('@shopgate/engage/a11y', () => ({ broadcastLiveMessage: jest.fn() }));
jest.mock('../Characteristics/Characteristic', () => () => null);
jest.mock('../Characteristics/Swatch', () => () => null);

const variants: ProductVariants = {
  characteristics: [
    {
      id: 'color',
      label: 'Color',
      values: [{ id: 'red', label: 'Red' }, { id: 'blue', label: 'Blue' }],
    },
  ],
  products: [
    { id: 'red-1', characteristics: { color: 'red' } },
    { id: 'blue-1', characteristics: { color: 'blue' } },
  ],
};

const TestRenderer = ({
  charRef, id, label, values, select, highlight, selected,
}: VariantRendererProps) => (
  <div
    ref={charRef as React.RefObject<HTMLDivElement>}
    tabIndex={-1}
    data-testid={`row-${id}`}
    data-highlight={highlight ? 'true' : undefined}
    data-selected={selected ?? undefined}
  >
    {label}
    {values.map(value => (
      <button key={value.id} type="button" onClick={() => select({ id, value: value.id })}>
        {value.label}
      </button>
    ))}
  </div>
);

const mockVariants = (
  value: ProductVariants | null,
  hasVariants: boolean | null,
  entry: { isFetching: boolean } | undefined = undefined
) => {
  (getProductVariants as unknown as jest.Mock).mockReturnValue(value);
  (hasProductVariants as unknown as jest.Mock).mockReturnValue(hasVariants);
  (getProductVariantsState as unknown as jest.Mock).mockReturnValue(entry ? { base: entry } : {});
};

describe('<VariantSelector />', () => {
  beforeAll(() => {
    registerVariantRenderer('dropdown', TestRenderer);
    Element.prototype.scrollIntoView = jest.fn();
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders a skeleton while the variants of a variant product are loading', () => {
    mockVariants(null, true);
    render(<VariantSelector productId="base" />);

    expect(screen.getByTestId('variant-selector-skeleton')).toHaveAttribute('aria-busy', 'true');
  });

  it('keeps the skeleton while the variants request is running', () => {
    mockVariants(null, true, { isFetching: true });
    render(<VariantSelector productId="base" />);

    expect(screen.getByTestId('variant-selector-skeleton')).toBeInTheDocument();
  });

  it('renders nothing when the variants request failed', () => {
    mockVariants(null, true, { isFetching: false });
    const { container } = render(<VariantSelector productId="base" />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing for a product without variants', () => {
    mockVariants(null, false);
    const { container } = render(<VariantSelector productId="base" />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders the characteristics with the registered renderer and selects a variant', () => {
    mockVariants(variants, true);
    const onVariantSelected = jest.fn();
    render(<VariantSelector productId="base" onVariantSelected={onVariantSelected} />);

    expect(screen.getByTestId('row-color')).toHaveTextContent('Color');

    fireEvent.click(screen.getByRole('button', { name: 'Blue' }));
    act(() => {
      jest.runAllTimers();
    });

    expect(onVariantSelected).toHaveBeenCalledWith('blue-1');
  });

  it('blocks the conditioner and highlights the first unselected characteristic', () => {
    mockVariants(variants, true);
    const conditions: Map<string, () => boolean> = new Map();
    const conditioner = {
      addConditioner: (name: string, fn: () => boolean) => conditions.set(name, fn),
      removeConditioner: (name: string) => conditions.delete(name),
    };
    const { unmount } = render(<VariantSelector productId="base" conditioner={conditioner} />);

    const check = conditions.get('product-variants');
    let result: boolean | undefined;
    act(() => {
      result = check?.();
    });

    expect(result).toBe(false);
    expect(screen.getByTestId('row-color')).toHaveAttribute('data-highlight', 'true');
    expect(screen.getByTestId('row-color')).toHaveFocus();

    unmount();
    expect(conditions.has('product-variants')).toBe(false);
  });
});
