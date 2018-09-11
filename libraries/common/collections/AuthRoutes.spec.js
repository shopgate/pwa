import authRoutes from './AuthRoutes';

describe('AuthRoutes', () => {
  describe('.isProtector()', () => {
    const PROTECTOR = '/protector';
    const PROTECTED = '/protected';

    beforeEach(() => {
      authRoutes.constructor();
      authRoutes.set('/protected_not_relevant', '/protector_not_relevant');
      authRoutes.set(PROTECTED, PROTECTOR);
    });

    it('should return true for a protector route', () => {
      expect(authRoutes.isProtector(PROTECTOR)).toBe(true);
    });

    it('should return false for a protected route', () => {
      expect(authRoutes.isProtector(PROTECTED)).toBe(false);
    });
  });
});
