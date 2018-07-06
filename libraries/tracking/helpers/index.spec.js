import { setPWAVisibleState, isPWAVisible } from './index';

describe('Tracking helpers', () => {
  describe('isPWAVisible()', () => {
    it('should return true when nothing was set before', () => {
      expect(isPWAVisible()).toBe(true);
    });

    it('should return false when the state was set to false', () => {
      setPWAVisibleState(false);
      expect(isPWAVisible()).toBe(false);
    });
  });

  describe('setPWAVisibleState()', () => {
    it('should set the state to false', () => {
      setPWAVisibleState(false);
      expect(isPWAVisible()).toBe(false);
    });

    it('should set the state to true', () => {
      setPWAVisibleState(true);
      expect(isPWAVisible()).toBe(true);
    });
  });
});
