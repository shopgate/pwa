import React from 'react';
import { render } from '@testing-library/react';
import ProductGrid from './index';

const mockMounts = jest.fn();

/* eslint-disable react/prop-types */
jest.mock('@shopgate/engage/components', () => {
  const { createElement, createContext } = jest.requireActual('react');
  return {
    ViewContext: createContext({ getContentRef: () => null }),
    LoadingIndicator: () => null,
    InfiniteContainer: ({ wrapper, iterator: Iterator, items }) => createElement(
      wrapper,
      {},
      items.map(item => <Iterator key={item.id} {...item} />)
    ),
  };
});
jest.mock('@shopgate/engage/product', () => ({
  ProductListTypeProvider: ({ children }) => children,
}));
jest.mock('./components/Iterator', () => {
  const { useEffect } = jest.requireActual('react');
  return ({ id }) => {
    useEffect(() => {
      mockMounts(id);
    }, [id]);
    return <div>{id}</div>;
  };
});
jest.mock('./components/Layout', () => ({ children }) => <div>{children}</div>);
jest.mock('./hooks', () => ({ useProductGridColumns: () => 2 }));
/* eslint-enable react/prop-types */

describe('<ProductGrid /> with infinite loading', () => {
  it('keeps the items mounted when the products update', () => {
    const props = {
      infiniteLoad: true,
      handleGetProducts: jest.fn(),
      totalProductCount: 2,
      requestHash: 'hash',
    };
    const { rerender } = render(<ProductGrid {...props} products={[{ id: 'a' }, { id: 'b' }]} />);

    rerender(<ProductGrid {...props} products={[{ id: 'a', name: 'loaded' }, { id: 'b' }]} />);

    expect(mockMounts).toHaveBeenCalledTimes(2);
  });
});
