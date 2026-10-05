import React from 'react';
import { act, render } from '@testing-library/react';
import useVariantSelection from './useVariantSelection';
import type { UseVariantSelectionOptions, UseVariantSelectionResult } from './useVariantSelection';
import type { ProductVariants } from './types';

const variants: ProductVariants = {
  characteristics: [
    {
      id: 'color',
      label: 'Color',
      values: [{ id: 'red', label: 'Red' }, { id: 'blue', label: 'Blue' }],
    },
    {
      id: 'size',
      label: 'Size',
      values: [{ id: 's', label: 'S' }, { id: 'm', label: 'M' }],
    },
  ],
  products: [
    { id: 'red-s', characteristics: { color: 'red', size: 's' } },
    { id: 'red-m', characteristics: { color: 'red', size: 'm' } },
    { id: 'blue-s', characteristics: { color: 'blue', size: 's' } },
  ],
};

const renderSelection = (options: UseVariantSelectionOptions) => {
  const ref: { current: UseVariantSelectionResult | null } = { current: null };

  const Consumer = (props: UseVariantSelectionOptions) => {
    ref.current = useVariantSelection(props);
    return null;
  };

  const utils = render(<Consumer {...options} />);

  return {
    get result() {
      return ref.current as UseVariantSelectionResult;
    },
    rerender: (next: UseVariantSelectionOptions) => utils.rerender(<Consumer {...next} />),
  };
};

describe('useVariantSelection', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns no rows while variants are not loaded', () => {
    const hook = renderSelection({ variants: null });

    expect(hook.result.rows).toEqual([]);
    expect(hook.result.isComplete).toBe(false);
  });

  it('disables dependent characteristics until the previous one is selected', () => {
    const hook = renderSelection({ variants });

    expect(hook.result.rows[0].disabled).toBe(false);
    expect(hook.result.rows[1].disabled).toBe(true);
    expect(hook.result.rows[1].values.every(value => !value.selectable)).toBe(true);
  });

  it('marks values that do not exist for the current selection as not selectable', () => {
    const hook = renderSelection({ variants });

    act(() => hook.result.select({ id: 'color', value: 'blue' }));

    const size = hook.result.rows[1];
    expect(size.values.find(value => value.id === 's')?.selectable).toBe(true);
    expect(size.values.find(value => value.id === 'm')?.selectable).toBe(false);
  });

  it('calls onVariantSelected after the finish timeout once the selection is complete', () => {
    const onVariantSelected = jest.fn();
    const onCharacteristicsChange = jest.fn();
    const hook = renderSelection({
      variants,
      onVariantSelected,
      onCharacteristicsChange,
      finishTimeout: 200,
    });

    act(() => hook.result.select({ id: 'color', value: 'red' }));
    act(() => hook.result.select({ id: 'size', value: 'm' }));

    expect(hook.result.isComplete).toBe(true);
    expect(onCharacteristicsChange).toHaveBeenLastCalledWith({ color: 'red', size: 'm' });
    expect(onVariantSelected).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(onVariantSelected).toHaveBeenCalledWith('red-m');
  });

  it('selects the characteristics of the given variant', () => {
    const onVariantSelected = jest.fn();
    const hook = renderSelection({ variants, variantId: 'blue-s', onVariantSelected });

    act(() => {
      jest.runAllTimers();
    });

    expect(hook.result.selection).toEqual({ color: 'blue', size: 's' });
    expect(onVariantSelected).not.toHaveBeenCalled();
  });

  it('preselects a single variant once the variants arrive', () => {
    const single: ProductVariants = {
      characteristics: [variants.characteristics[0]],
      products: [{ id: 'red-only', characteristics: { color: 'red' } }],
    };
    const onVariantSelected = jest.fn();
    const hook = renderSelection({ variants: null, onVariantSelected });

    hook.rerender({ variants: single, onVariantSelected });
    act(() => {
      jest.runAllTimers();
    });

    expect(hook.result.selection).toEqual({ color: 'red' });
    expect(onVariantSelected).toHaveBeenCalledWith('red-only');
  });

  it('syncs a selection that is passed from outside', () => {
    const hook = renderSelection({ variants });

    hook.rerender({ variants, characteristics: { color: 'blue' } });

    expect(hook.result.selection).toEqual({ color: 'blue' });
  });

  it('keeps other values selectable when variants list their characteristics in another order', () => {
    const reversed: ProductVariants = {
      ...variants,
      products: variants.products.map(product => ({
        ...product,
        characteristics: {
          size: product.characteristics.size,
          color: product.characteristics.color,
        },
      })),
    };
    const hook = renderSelection({ variants: reversed });

    act(() => hook.result.select({ id: 'color', value: 'red' }));
    act(() => hook.result.select({ id: 'size', value: 's' }));

    expect(Object.keys(hook.result.selection)).toEqual(['color', 'size']);
    expect(hook.result.rows[0].values.every(value => value.selectable)).toBe(true);
    expect(hook.result.rows[1].values.find(value => value.id === 'm')?.selectable).toBe(true);
  });

  it('returns the first unselected characteristic', () => {
    const hook = renderSelection({ variants });

    act(() => hook.result.select({ id: 'color', value: 'red' }));

    expect(hook.result.findFirstUnselected()?.id).toBe('size');
  });
});
