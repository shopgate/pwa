import { useColors } from '../useColors';
import { useConfig } from '../useConfig';

jest.mock('../useConfig', () => ({
  useConfig: jest.fn(),
}));

describe('engage > core > hooks', () => {
  describe('useColors()', () => {
    it('should return an empty object if no colors are specified', () => {
      useConfig.mockReturnValueOnce({});
      const colors = useColors();
      expect(colors).toEqual({});
    });

    it('should return an object containing colors', () => {
      useConfig.mockReturnValueOnce({ primary: '#ff0000' });
      const colors = useColors();
      expect(colors).toEqual({});
    });
  });
});
