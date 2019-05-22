import {
  getProductPropertiesState,
  getProductId,
} from '@shopgate/pwa-common-commerce/product/selectors/product';
import { makeGetProductProperties } from '../product';

jest.mock('@shopgate/pwa-common-commerce/product/selectors/product', () => ({
  getProductPropertiesState: jest.fn(),
  getProductId: jest.fn(),
}));

const mockState = {
  123: {
    properties: [{
      label: 'Test',
      value: '123',
    }],
  },
  456: { properties: null },
};

const getProductProperties = makeGetProductProperties();

describe('engage > product > selectors', () => {
  describe('getProductProperties()', () => {
    it('should return null if a properties state can not be found', () => {
      getProductPropertiesState.mockReturnValueOnce(mockState);
      getProductId.mockReturnValueOnce('012');
      const result = getProductProperties({}, {});
      expect(result).toEqual(null);
    });

    it('should return null of no properties have been received for the product', () => {
      getProductPropertiesState.mockReturnValueOnce(mockState);
      getProductId.mockReturnValueOnce('456');
      const result = getProductProperties({}, {});
      expect(result).toEqual(null);
    });

    it('should renturn properties if they are set for the product', () => {
      getProductPropertiesState.mockReturnValueOnce(mockState);
      getProductId.mockReturnValueOnce('123');
      const result = getProductProperties({}, {});
      expect(result).toEqual([{
        label: 'Test',
        value: '123',
      }]);
    });
  });
});
