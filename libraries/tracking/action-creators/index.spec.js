import { PWA_DID_APPEAR } from '../constants';
import { pwaDidAppear } from './index';

describe('action-creators', () => {
  describe('pwaDidAppear()', () => {
    it('should work as expected', () => {
      const result = pwaDidAppear();
      expect(result).toEqual({ type: PWA_DID_APPEAR });
    });
  });
});
