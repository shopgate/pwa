import { RECEIVE_APP_SETTINGS } from '@shopgate/engage/settings/constants/appSettings';
import { reviewsDidEnable$ } from './index';

/**
 * @param {boolean} showReviews The review setting of the merchant.
 * @returns {Object}
 */
const createState = showReviews => ({
  settings: {
    appSettings: {
      product: {
        rating: { showReviews },
      },
    },
  },
});

/**
 * @param {Object} options The test options.
 * @param {string} options.type The action type.
 * @param {boolean} options.before The review setting before the action.
 * @param {boolean} options.after The review setting after the action.
 * @returns {boolean}
 */
const matches = ({ type = RECEIVE_APP_SETTINGS, before, after }) => (
  reviewsDidEnable$.operator.predicate({
    action: { type },
    prevState: createState(before),
    getState: () => createState(after),
  })
);

describe('Reviews streams: reviewsDidEnable$', () => {
  it('should emit when received settings switch the reviews on', () => {
    expect(matches({
      before: false,
      after: true,
    })).toBe(true);
  });

  it('should not emit when the reviews stay on', () => {
    expect(matches({
      before: true,
      after: true,
    })).toBe(false);
  });

  it('should not emit when the reviews are switched off', () => {
    expect(matches({
      before: true,
      after: false,
    })).toBe(false);
  });

  it('should not emit for other actions', () => {
    expect(matches({
      type: 'SOME_ACTION',
      before: false,
      after: true,
    })).toBe(false);
  });
});
