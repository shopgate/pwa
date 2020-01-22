import {
  makeIsLastStackEntry,
  makeGetRoutePattern,
  makeGetRouteParam,
  makeGetPrevRoute,
} from './router';

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
      params: {
        key: 'value',
      },
    }, {
      id: '234',
      pathname: '/some-route2',
      pattern: '/some-route2',
      state: {},
    }],
    currentRoute: {
      id: '123',
      pathname: '/some-route',
      pattern: '/some-route',
      state: {},
      params: {
        key: 'value',
      },
    },
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

  describe('makeGetPrevRoute()', () => {
    let getPrevRoute;
    beforeEach(() => {
      getPrevRoute = makeGetPrevRoute();
    });

    it('should return null for index route', () => {
      const result = getPrevRoute({
        router: {
          currentRoute: mockState.router.stack[0],
          ...mockState.router,
        },
      }, { routeId: 'abc' });
      expect(result).toBeNull();
    });

    it('should return prev for last route', () => {
      const result = getPrevRoute({
        router: {
          currentRoute: mockState.router.stack[2],
          ...mockState.router,
        },
      }, { routeId: '234' });
      expect(result).toEqual(mockState.router.stack[1]);
    });

    it('should return prev for not last route', () => {
      const result = getPrevRoute({
        router: {
          currentRoute: mockState.router.stack[1],
          ...mockState.router,
        },
      }, { routeId: '123' });
      expect(result).toEqual(mockState.router.stack[0]);
    });
  });

  describe('makeGetRoutePattern()', () => {
    it('should create a fresh instance on every call', () => {
      const instanceOne = makeGetRoutePattern();
      const instanceTwo = makeGetRoutePattern();
      expect(instanceOne).not.toBe(instanceTwo);
    });

    it('should return the expected route pattern for the current route', () => {
      const getRoutePattern = makeGetRoutePattern();
      const result = getRoutePattern(mockState, {});
      expect(result).toBe('/some-route');
    });

    it('should return the expected route pattern for a route referenced by a routeId', () => {
      const getRoutePattern = makeGetRoutePattern();
      const result = getRoutePattern(mockState, { routeId: '123' });
      expect(result).toBe('/some-route');
    });

    it('should return NULL when no route can be determined', () => {
      const getRoutePattern = makeGetRoutePattern();
      const result = getRoutePattern({ router: { stack: [] } }, { routeId: 'xyz' });
      expect(result).toBe(null);
    });
  });

  describe('makeGetRouteParam()', () => {
    it('should create a fresh instance on every call', () => {
      const instanceOne = makeGetRouteParam();
      const instanceTwo = makeGetRouteParam();
      expect(instanceOne).not.toBe(instanceTwo);
    });

    it('should return the expected route param for the current route', () => {
      const getRouteParam = makeGetRouteParam('key');
      const result = getRouteParam(mockState, {});
      expect(result).toBe('value');
    });

    it('should return the expected route pattern for a route referenced by a routeId', () => {
      const getRouteParam = makeGetRouteParam('key');
      const result = getRouteParam(mockState, { routeId: '123' });
      expect(result).toBe('value');
    });

    it('should return NULL when no route params can be determined', () => {
      const getRouteParam = makeGetRouteParam('key');
      const result = getRouteParam(mockState, { routeId: 'abc' });
      expect(result).toBe(null);
    });

    it('should return NULL when the requested parameter does not exist within the params', () => {
      const getRouteParam = makeGetRouteParam('does-not-exist');
      const result = getRouteParam(mockState);
      expect(result).toBe(null);
    });
  });
});
