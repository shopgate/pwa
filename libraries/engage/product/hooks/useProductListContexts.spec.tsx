import React from 'react';
import { render } from '@testing-library/react';
import ProductListTypeProvider from '../providers/ProductListType';
import ProductListEntryProvider from '../providers/ProductListEntry';
import useProductListType from './useProductListType';
import useProductListEntry from './useProductListEntry';
import type { ProductListTypeContextValue } from '../providers/ProductListType/context';
import type { ProductListEntryContextValue } from '../providers/ProductListEntry/context';

interface HookValues {
  type: ProductListTypeContextValue;
  entry: ProductListEntryContextValue;
}

/**
 * Renders a component that reads both product list contexts.
 * @param wrap Wraps the reading component, e.g. with providers.
 * @returns The values returned by the hooks.
 */
const readContexts = (
  wrap: (children: React.ReactElement) => React.ReactElement = children => children
): HookValues => {
  let values = {} as HookValues;

  const Reader = () => {
    values = {
      type: useProductListType(),
      entry: useProductListEntry(),
    };
    return null;
  };

  render(wrap(<Reader />));
  return values;
};

describe('engage > product > hooks > product list contexts', () => {
  it('should return empty values outside of the providers', () => {
    expect(readContexts()).toEqual({
      type: {
        type: null,
        subType: null,
        meta: null,
      },
      entry: {
        productId: null,
        productListType: null,
        productListSubType: null,
      },
    });
  });

  it('should return the values of the providers', () => {
    const meta = { widgetId: 'w1' };

    const values = readContexts(children => (
      <ProductListTypeProvider type="productSlider" subType="widgets" meta={meta}>
        <ProductListEntryProvider productId="p1">
          {children}
        </ProductListEntryProvider>
      </ProductListTypeProvider>
    ));

    expect(values).toEqual({
      type: {
        type: 'productSlider',
        subType: 'widgets',
        meta,
      },
      entry: {
        productId: 'p1',
        productListType: 'productSlider',
        productListSubType: 'widgets',
      },
    });
  });
});
