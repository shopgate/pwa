import { DEFAULT_TAB_BAR_ITEMS } from './constants';

describe('DEFAULT_TAB_BAR_ITEMS', () => {
  it('is frozen', () => {
    expect(Object.isFrozen(DEFAULT_TAB_BAR_ITEMS)).toBe(true);
  });

  it('has frozen items', () => {
    DEFAULT_TAB_BAR_ITEMS.forEach((item) => {
      expect(Object.isFrozen(item)).toBe(true);
    });
  });
});
