import withMapPricing from './withMapPricing';

jest.mock('@shopgate/pwa-common/components/TimeBoundary');
jest.mock('@shopgate/pwa-common-commerce/product/helpers/mapPrice', () => ({
  isVisiblePLP: true,
}));

describe('withMapPricing', () => {
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

  describe('should keep origin price', () => {
    it('should return empty props', () => {
      const component = withMapPricing(mockComponent)({});
      expect(component.props).toEqual({});
    });

    it('should return original price', () => {
      const component = withMapPricing(mockComponent)({ price });
      expect(component.props).toEqual({ price });
    });
    it('should return origin with lesser mapPrice', () => {
      const component = withMapPricing(mockComponent)({
        price: {
          ...price,
          mapPricing: {
            ...mapPricing,
            price: 90,
          },
        },
      });
      expect(component.props).toEqual({
        price: {
          ...price,
          mapPricing: {
            ...mapPricing,
            price: 90,
          },
        },
      });
    });

    it('should not mutate when mapPrice out of time boundary', () => {
      const component = withMapPricing(mockComponent)({
        price: {
          ...price,
          mapPricing,
        },
      });
      expect(component.props.children).toBeInstanceOf(Function);

      // Simulate time boundary
      const children = component.props.children({ between: false });
      expect(children.props).toEqual({
        price: {
          ...price,
          mapPricing,
        },
      });
    });
  });

  describe('should mutate', () => {
    it('should mutate strike price', () => {
      const component = withMapPricing(mockComponent)({
        price: {
          ...price,
          mapPricing,
        },
      });
      expect(component.props.children).toBeInstanceOf(Function);

      // Simulate time boundary
      const children = component.props.children({ between: true });
      expect(children.props).toEqual({
        price: {
          ...price,
          unitPriceStriked: 120, // mutated
          mapPricing,
        },
      });
    });
  });
});
