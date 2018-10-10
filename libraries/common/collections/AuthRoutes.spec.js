import authRoutes from './AuthRoutes';

describe('AuthRoutes', () => {
  const PROTECTOR = '/protector';
  const PROTECTED = '/protected';

  beforeEach(() => {
    authRoutes.constructor();
    authRoutes.set('/protected_not_relevant', '/protector_not_relevant');
    authRoutes.set(PROTECTED, PROTECTOR);
  });

  describe('.get()', () => {
    it('should return the protector for a protected route', () => {
      expect(authRoutes.get(PROTECTED)).toBe(PROTECTOR);
    });

    it('should return NULL when no protector was set for the passed route', () => {
      expect(authRoutes.get('/some_route')).toBeNull();
    });
  });

  describe('.getAll()', () => {
    it('should return the routes Map', () => {
      const result = authRoutes.getAll();
      expect(result).toBeInstanceOf(Map);
      expect(result.size).toBe(2);
    });
  });

  describe('.set()', () => {
    beforeEach(() => {
      authRoutes.constructor();
    });

    it('should only add routes when both method parameters are set', () => {
      expect(authRoutes.routes.size).toBe(0);
      authRoutes.set();
      expect(authRoutes.routes.size).toBe(0);
      authRoutes.set(PROTECTED);
      expect(authRoutes.routes.size).toBe(0);
      authRoutes.set(PROTECTED, PROTECTOR);
      expect(authRoutes.routes.size).toBe(1);
      expect(authRoutes.get(PROTECTED)).toBe(PROTECTOR);
    });
  });

  describe('.isProtector()', () => {
    it('should return true for a protector route', () => {
      expect(authRoutes.isProtector(PROTECTOR)).toBe(true);
    });

    it('should return false for a protected route', () => {
      expect(authRoutes.isProtector(PROTECTED)).toBe(false);
    });
  });

  describe('.getProtector()', () => {
    beforeEach(() => {
      authRoutes.constructor();
    });

    it('should return a protector for a distinct route', () => {
      authRoutes.set(PROTECTED, PROTECTOR);
      expect(authRoutes.getProtector(PROTECTED)).toBe(PROTECTOR);
    });

    it('should return a protector for a route which matches a registered pattern', () => {
      authRoutes.set(`${PROTECTED}/:id`, PROTECTOR);
      expect(authRoutes.getProtector(`${PROTECTED}/abc123`)).toBe(PROTECTOR);
    });

    it('should return a protector for a route which matches a registered pattern', () => {
      authRoutes.set(PROTECTED, PROTECTOR);
      expect(authRoutes.getProtector(`${PROTECTED}?some=param`)).toBe(PROTECTOR);
    });

    it('should return NULL when no protector can be determined', () => {
      authRoutes.set(`${PROTECTED}/:id`, PROTECTOR);
      expect(authRoutes.getProtector('/protected/abc123/foobar')).toBeNull();
    });
  });
});
