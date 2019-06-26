import { useWidgetSettings } from '../../core';
import withMapPricing from './withMapPricing';

jest.mock('@shopgate/engage/components', () => ({
  TimeBoundary: jest.fn(),
}));
jest.mock('../../core', () => ({
  useWidgetSettings: jest.fn(),
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
    jest.resetAllMocks();
  });

  describe('should keep origin price', () => {
    it('should return origin when settings is off', () => {
      useWidgetSettings.mockReturnValue({ show: false });
      expect(withMapPricing(mockComponent)({}).props).toEqual({});
    });

    it('should return empty props', () => {
      useWidgetSettings.mockReturnValue({ show: true });
      expect(withMapPricing(mockComponent)({}).props).toEqual({});
    });

    it('should return original price', () => {
      useWidgetSettings.mockReturnValue({ show: true });
      expect(withMapPricing(mockComponent)({ price }).props).toEqual({ price });
    });
    it('should return origin with lesser mapPrice', () => {
      useWidgetSettings.mockReturnValue({ show: true });
      const component = withMapPricing(mockComponent)({
        price: {
          ...price,
          mapPricing: [{
            ...mapPricing,
            price: 90,
          }],
        },
      });
      expect(component.props).toEqual({
        price: {
          ...price,
          mapPricing: [{
            ...mapPricing,
            price: 90,
          }],
        },
      });
    });

    it('should not mutate when mapPrice out of time boundary', () => {
      useWidgetSettings.mockReturnValue({ show: true });
      const component = withMapPricing(mockComponent)({
        price: {
          ...price,
          mapPricing: [{ ...mapPricing }],
        },
      });
      expect(component.props.children).toBeInstanceOf(Function);

      // Simulate time boundary
      const children = component.props.children({ between: false });
      expect(children.props).toEqual({
        price: {
          ...price,
          mapPricing: [{ ...mapPricing }],
        },
      });
    });
  });

  describe('should mutate', () => {
    it('should mutate strike price', () => {
      useWidgetSettings.mockReturnValue({ show: true });
      const component = withMapPricing(mockComponent)({
        price: {
          ...price,
          mapPricing: [{ ...mapPricing }],
        },
      });
      expect(component.props.children).toBeInstanceOf(Function);

      // Simulate time boundary
      const children = component.props.children({ between: true });
      expect(children.props).toEqual({
        price: {
          ...price,
          unitPriceStriked: 120, // mutated
          mapPricing: [{ ...mapPricing }],
        },
      });
    });
  });
});
