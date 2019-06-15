import { makeIsLastStackEntry } from './router';

const mockState = {
  router: {
    stack: [{
      id: 'abc',
      pathname: '/',
      pattern: '/',
      state: {},
    }, {
      id: '123',
      pathname: '/some-route',
      pattern: '/some-route',
      state: {},
    }],
  },
};

describe('Router selectors', () => {
  describe('makeIsLastStackEntry()', () => {
    it('should create a fresh instance on every call', () => {
      const instanceOne = makeIsLastStackEntry();
      const instanceTwo = makeIsLastStackEntry();
      expect(instanceOne).not.toBe(instanceTwo);
    });

    it('should return TRUE when the routeId belongs to the last stack entry', () => {
      const isLastStackEntry = makeIsLastStackEntry();
      const result = isLastStackEntry(mockState, { routeId: '123' });
      expect(result).toBe(true);
    });

    it('should return FALSE when the routeId does not belong to the last stack entry', () => {
      const isLastStackEntry = makeIsLastStackEntry();
      const result = isLastStackEntry(mockState, { routeId: 'abc' });
      expect(result).toBe(false);
    });

    it('should return FALSE when there is not route for the passed routeId', () => {
      const isLastStackEntry = makeIsLastStackEntry();
      const result = isLastStackEntry(mockState, { routeId: 'xyz' });
      expect(result).toBe(false);
    });
  });
});
