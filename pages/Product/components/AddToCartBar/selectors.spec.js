import {
  selectActionCount,
  isVisible,
} from './selectors';

/**
 * Creates a state for the AddToCartBar.
 * @param {number} added The number of added products.
 * @param {boolean} visible Is the bar visible.
 * @return {Object}
 */
const createState = (added = 3, visible = false) => ({
  ui: {
    addToCartBar: {
      added,
      visible,
    },
  },
});

describe('AddToCartBar selectors', () => {
  describe('selectActionCount()', () => {
    it('should return 3', () => {
      const result = selectActionCount(createState(3));
      expect(result).toBe(3);
    });
  });

  describe('isVisible()', () => {
    it('should return true', () => {
      const result = isVisible(createState(3, true));
      expect(result).toBe(true);
    });

    it('should return false', () => {
      const result = isVisible(createState(3, false));
      expect(result).toBe(false);
    });
  });
});
