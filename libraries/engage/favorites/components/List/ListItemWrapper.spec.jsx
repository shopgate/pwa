import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ListItemWrapper from './ListItemWrapper';

// eslint-disable-next-line react/prop-types
jest.mock('../Item', () => ({ addToCart }) => (
  <>
    <button type="button" onClick={e => addToCart(e)}>base</button>
    <button type="button" onClick={() => addToCart(null, { id: 'variant-1' })}>variant</button>
    <button
      type="button"
      onClick={() => addToCart(null, { id: 'variant-2', fulfillmentMethods: ['ROPIS'] })}
    >
      variant with methods
    </button>
  </>
));

const product = { id: 'base-1', fulfillmentMethods: ['DIRECT_SHIP'] };

/**
 * Renders the wrapper.
 * @param {Function} addToCart The add to cart handler.
 */
const renderWrapper = addToCart => render(
  <ListItemWrapper
    listId="list"
    product={product}
    quantity={2}
    addToCart={addToCart}
    removeItem={jest.fn()}
    items={[product]}
    index={0}
  />
);

describe('<ListItemWrapper />', () => {
  it('adds the favorited product with its own id as list item', () => {
    const addToCart = jest.fn();
    renderWrapper(addToCart);

    fireEvent.click(screen.getByRole('button', { name: 'base' }));

    expect(addToCart).toHaveBeenCalledWith(product, 2, 'base-1');
  });

  it('adds a variant, keeps the base product as list item and falls back to its fulfillment methods', () => {
    const addToCart = jest.fn();
    renderWrapper(addToCart);

    fireEvent.click(screen.getByRole('button', { name: 'variant' }));
    expect(addToCart).toHaveBeenLastCalledWith(
      { id: 'variant-1', fulfillmentMethods: ['DIRECT_SHIP'] },
      2,
      'base-1'
    );

    fireEvent.click(screen.getByRole('button', { name: 'variant with methods' }));
    expect(addToCart).toHaveBeenLastCalledWith(
      { id: 'variant-2', fulfillmentMethods: ['ROPIS'] },
      2,
      'base-1'
    );
  });
});
