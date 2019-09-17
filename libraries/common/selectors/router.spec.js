import { makeIsLastStackEntry, getPrevRoute } from './router';

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
    }, {
      id: '234',
      pathname: '/some-route2',
      pattern: '/some-route2',
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
      const result = isLastStackEntry(mockState, { routeId: '234' });
      expect(result).toBe(true);
    });

    it('should return FALSE when the routeId does not belong to the last stack entry', () => {
      const isLastStackEntry = makeIsLastStackEntry();
      const result = isLastStackEntry(mockState, { routeId: '123' });
      expect(result).toBe(false);
    });

    it('should return FALSE when the stack is empty', () => {
      const isLastStackEntry = makeIsLastStackEntry();
      const result = isLastStackEntry({ router: { stack: [] } }, { routeId: 'xyz' });
      expect(result).toBe(false);
    });
  });

  describe('getPrevRoute()', () => {
    it('should return null for index route', () => {
      const result = getPrevRoute({
        router: {
          currentRoute: mockState.router.stack[0],
          ...mockState.router,
        },
      });
      expect(result).toBeNull();
    });

    it('should return prev for last route', () => {
      const result = getPrevRoute({
        router: {
          currentRoute: mockState.router.stack[2],
          ...mockState.router,
        },
      });
      expect(result).toEqual(mockState.router.stack[1]);
    });

    it('should return prev for not last route', () => {
      const result = getPrevRoute({
        router: {
          currentRoute: mockState.router.stack[1],
          ...mockState.router,
        },
      });
      expect(result).toEqual(mockState.router.stack[0]);
    });
  });
});
