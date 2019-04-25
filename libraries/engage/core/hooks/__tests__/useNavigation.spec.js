import { useNavigation } from '../useNavigation';

describe('engage > core > hooks', () => {
  describe('useNavigation()', () => {
    it('should return the push() function', () => {
      const result = useNavigation();
      expect(result.hasOwnProperty('push')).toBe(true);
      expect(typeof result.push).toBe('function');
    });

    it('should return the pop() function', () => {
      const result = useNavigation();
      expect(result.hasOwnProperty('pop')).toBe(true);
      expect(typeof result.pop).toBe('function');
    });

    it('should return the replace() function', () => {
      const result = useNavigation();
      expect(result.hasOwnProperty('replace')).toBe(true);
      expect(typeof result.replace).toBe('function');
    });

    it('should return the reset() function', () => {
      const result = useNavigation();
      expect(result.hasOwnProperty('reset')).toBe(true);
      expect(typeof result.reset).toBe('function');
    });

    it('should return the update() function', () => {
      const result = useNavigation();
      expect(result.hasOwnProperty('update')).toBe(true);
      expect(typeof result.update).toBe('function');
    });
  });
});
