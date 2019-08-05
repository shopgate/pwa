import { useContext } from 'react';
import AppContext from '../../contexts/AppContext';
import { useApp } from '../useApp';

jest.mock('react', () => ({
  useContext: jest.fn(),
  createContext: jest.fn(),
}));

describe('engage > core > hooks', () => {
  describe('useApp()', () => {
    it('should return an empty if no app context is defined.', () => {
      useContext.mockReturnValueOnce({ });
      const app = useApp();
      expect(useContext).toHaveBeenCalledWith(AppContext);
      expect(app).toEqual({});
    });

    it('should return object containing app context properties.', () => {
      useContext.mockReturnValueOnce({
        some: 'prop',
      });

      const app = useApp();
      expect(app).toEqual({ some: 'prop' });
    });
  });
});
