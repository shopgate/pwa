import collection from '../portalCollection';
import { APP_ROUTES } from '../../../constants/Portals';

jest.mock('../../config', () => ({
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
  let routePortals;

  const portals = {
    route1: jest.fn(() => 'route1 content'),
    route2: jest.fn(() => null),
    route10: jest.fn(() => 'route10 content'),
    route20: jest.fn(() => null),
  };

  jest.spyOn(collection, 'getPortals').mockReturnValue(portals);

  it('should read from static config', () => {
    jest.isolateModules(() => {
      // eslint-disable-next-line global-require
      routePortals = require('../routePortals').default;
    });

    expect(routePortals).toEqual([
      'route1 content',
    ]);
  });

  it('should read from registered config', () => {
    jest.spyOn(collection, 'getConfig').mockReturnValue({
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
    });

    jest.isolateModules(() => {
      // eslint-disable-next-line global-require
      routePortals = require('../routePortals').default;
    });

    expect(routePortals).toEqual([
      'route10 content',
    ]);
  });
});
