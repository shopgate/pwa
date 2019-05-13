import withPriceCalculation from './withPriceCalculation';
import withMapPricing from './withMapPricing';

jest.mock('./withMapPricing');

describe('withPriceCalculation', () => {
  const price = {
    unitPrice: 100.0,
    unitPriceStriked: 150.0,
  };

  const mapPricing = {
    price: 120.0,
  };

  let mockComponent;
  beforeEach(() => {
    mockComponent = jest.fn();
  });

  it('should return empty props', () => {
    const component = withPriceCalculation(mockComponent)({});
    expect(component.props).toEqual({});
  });

  it('should return original price', () => {
    const component = withPriceCalculation(mockComponent)({ price });
    expect(component.props).toEqual({ price });
  });
  it('should invoke withMapPricing hoc', () => {
    const thunk = jest.fn();
    withMapPricing.mockReturnValue(thunk);
    withPriceCalculation(mockComponent)({
      price: {
        ...price,
        mapPricing,
      },
    });
    expect(withMapPricing).toBeCalledTimes(1);
    expect(thunk).toBeCalledWith({
      price: {
        ...price,
        mapPricing,
      },
    });
  });
});
