import React from 'react';
import { render } from '@testing-library/react';
import { withCurrentProduct } from '../withCurrentProduct';

jest.mock('@shopgate/pwa-common/context', () => {
  const { createContext } = jest.requireActual('react');

  return {
    ThemeContext: createContext({
      contexts: {
        ProductContext: createContext({
          id: '123',
          name: 'acme',
          price: {
            currency: 'EUR',
            unitPrice: 22.95,
            unitPriceStriked: 25.95,
          },
        }),
      },
    }),
  };
});

const mockWrappedComponent = jest.fn(props => (
  <pre data-testid="wrapped-props">{JSON.stringify(props)}</pre>
));

describe('engage > core > hocs > withCurrentProduct', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should inject the context properties into the component', () => {
    const ComposedComponent = withCurrentProduct(mockWrappedComponent);
    const { container } = render(<ComposedComponent someProp />);

    expect(container.firstChild).toMatchSnapshot();
    expect(mockWrappedComponent).toHaveBeenCalledTimes(1);
    expect(mockWrappedComponent.mock.calls[0][0]).toEqual({
      someProp: true,
      id: '123',
      name: 'acme',
      price: {
        currency: 'EUR',
        unitPrice: 22.95,
        unitPriceStriked: 25.95,
      },
    });
  });

  it('should inject a single property with the context into the component', () => {
    const ComposedComponent = withCurrentProduct(mockWrappedComponent, { prop: 'product' });
    const { container } = render(<ComposedComponent someProp />);

    expect(container.firstChild).toMatchSnapshot();
    expect(mockWrappedComponent).toHaveBeenCalledTimes(1);
    expect(mockWrappedComponent.mock.calls[0][0]).toEqual({
      someProp: true,
      product: {
        id: '123',
        name: 'acme',
        price: {
          currency: 'EUR',
          unitPrice: 22.95,
          unitPriceStriked: 25.95,
        },
      },
    });
  });
});
