import { useContext } from 'react';
import { useTheme } from '../useTheme';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}));

describe('engage > core > hooks', () => {
  describe('useTheme()', () => {
    it('should return an empty if no theme context is defined.', () => {
      useContext.mockReturnValueOnce({ contexts: {} });
      const theme = useTheme();
      expect(theme).toEqual({});
    });

    it('should return object containing react components.', () => {
      useContext.mockReturnValueOnce({
        contexts: {},
        Some: () => null,
        Thing: () => null,
      });

      const theme = useTheme();
      expect(theme.Some).toBeTruthy();
      expect(theme.Thing).toBeTruthy();
    });
  });
});
