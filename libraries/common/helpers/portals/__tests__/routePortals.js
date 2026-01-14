import { APP_ROUTES } from '../../../constants/Portals';

jest.mock('../../config', () => ({
  __esModule: true,
  componentsConfig: {
    portals: {
      route1: {
        path: 'route1.jsx',
        target: 'app.routes',
      },
      component1: {
        path: 'component1.jsx',
        target: 'view.before',
      },
      route2: {
        path: 'route2.jsx',
        target: 'app.routes',
      },
    },
  },
}));

describe('helpers/portals/routePortals.js', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
    jest.clearAllMocks();
    jest.unmock('../portalCollection');
  });

  it('should read from static config', () => {
    jest.isolateModules(() => {
      const collection = jest.requireActual('../portalCollection').default;

      const originalGetPortals = collection.getPortals;
      collection.getPortals = jest.fn(() => ({
        route1: jest.fn(() => 'route1 content'),
        route2: jest.fn(() => null),
      }));

      const routePortals = jest.requireActual('../routePortals').default;

      expect(routePortals).toEqual(['route1 content']);

      collection.getPortals = originalGetPortals;
    });
  });

  it('should read from registered config', () => {
    jest.doMock('../../config', () => ({
      __esModule: true,
      componentsConfig: { portals: {} },
    }));

    jest.isolateModules(() => {
      const collection = jest.requireActual('../portalCollection').default;

      const originalGetPortals = collection.getPortals;
      const originalGetConfig = collection.getConfig;

      collection.getPortals = jest.fn(() => ({
        route10: jest.fn(() => 'route10 content'),
        route20: jest.fn(() => null),
      }));
      collection.getConfig = jest.fn(() => ({
        route10: {
          path: 'route10.jsx',
          target: APP_ROUTES,
        },
        component10: {
          path: 'component10.jsx',
          target: 'view.before',
        },
        route20: {
          path: 'route20.jsx',
          target: APP_ROUTES,
        },
      }));

      const routePortals = jest.requireActual('../routePortals').default;

      expect(routePortals).toEqual(['route10 content']);

      collection.getPortals = originalGetPortals;
      collection.getConfig = originalGetConfig;
    });
  });
});
