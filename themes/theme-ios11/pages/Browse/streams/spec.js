import { ROUTE_WILL_ENTER } from '@shopgate/pwa-common/constants/ActionTypes';
import { BROWSE_PATH } from '../constants';
import { browsePageWillEnter$ } from '.';

describe('RootCategory streams', () => {
  describe('browsePageWillEnter$', () => {
    it('should return true', () => {
      const action = {
        type: ROUTE_WILL_ENTER,
        route: {
          pattern: BROWSE_PATH,
        },
      };
      const willEnter = browsePageWillEnter$.operator.predicate({ action });
      expect(willEnter).toBe(true);
    });

    it('should return false', () => {
      const action = {
        type: ROUTE_WILL_ENTER,
        route: {
          pattern: 'some_other/pattern',
        },
      };
      const willEnter = browsePageWillEnter$.operator.predicate({ action });
      expect(willEnter).toBe(false);
    });
  });
});
