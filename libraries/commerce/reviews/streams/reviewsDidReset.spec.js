import { RESET_APP } from '@shopgate/pwa-common/constants/ActionTypes';
import { RESET_APP_REDUCERS } from '@shopgate/pwa-common/constants/Configuration';
import configuration from '@shopgate/pwa-common/collections/Configuration';
import { reviewsDidReset$ } from './index';

/**
 * @param {Object} action The dispatched action.
 * @returns {boolean}
 */
const matches = action => reviewsDidReset$.operator.predicate({ action });

describe('Reviews streams: reviewsDidReset$', () => {
  afterEach(() => {
    configuration.set(RESET_APP_REDUCERS, undefined);
  });

  it('should emit when the reviews state is reset explicitly', () => {
    expect(matches({
      type: RESET_APP,
      reducers: ['reviews'],
    })).toBe(true);
  });

  it('should not emit when an explicit reset list excludes the reviews state', () => {
    configuration.set(RESET_APP_REDUCERS, ['reviews']);
    expect(matches({
      type: RESET_APP,
      reducers: ['cart'],
    })).toBe(false);
  });

  it('should emit for a reset whose configured reducer list includes the reviews state', () => {
    configuration.set(RESET_APP_REDUCERS, ['cart', 'reviews']);
    expect(matches({ type: RESET_APP })).toBe(true);
  });

  it('should not emit for a reset whose configured reducer list excludes the reviews state', () => {
    configuration.set(RESET_APP_REDUCERS, ['cart']);
    expect(matches({ type: RESET_APP })).toBe(false);
  });

  it('should not emit for a reset without any reducer list', () => {
    expect(matches({ type: RESET_APP })).toBe(false);
  });

  it('should not emit for other actions', () => {
    expect(matches({
      type: 'SOME_ACTION',
      reducers: ['reviews'],
    })).toBe(false);
  });
});
