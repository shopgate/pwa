import redirects from './Redirects';

const FROM = '/from';
const TO = '/to';

describe('Redirects', () => {
  beforeEach(() => {
    redirects.constructor();
  });

  describe('get()', () => {
    it('should get a valid redirect', () => {
      redirects.set(FROM, TO);
      expect(redirects.get(FROM)).toEqual(TO);
    });
  });

  describe('set()', () => {
    it('should add a redirect', () => {
      redirects.set(FROM, TO);
      expect(redirects.redirects.size).toEqual(1);
      expect(redirects.get(FROM)).toEqual(TO);
    });

    it('should not override an existing redirect', () => {
      redirects.set(FROM, TO);
      redirects.set(FROM, '/somewhere_else');
      expect(redirects.redirects.size).toEqual(1);
      expect(redirects.get(FROM)).toEqual(TO);
    });

    it('should forcefully add a redirect', () => {
      redirects.set(FROM, TO);
      redirects.set(FROM, '/somewhere_else', true);
      expect(redirects.redirects.size).toEqual(1);
      expect(redirects.get(FROM)).toEqual('/somewhere_else');
    });

    it('should not add when a from path is not given', () => {
      redirects.set();
      expect(redirects.redirects.size).toEqual(0);
    });

    it('should not add when a to path is not given', () => {
      redirects.set(FROM);
      expect(redirects.redirects.size).toEqual(0);
    });

    it('should add a promise as redirect', () => {
      const promise = new Promise(() => {});
      redirects.set(FROM, promise);
      expect(redirects.redirects.size).toEqual(1);
      expect(redirects.get(FROM)).toBe(promise);
    });
  });

  describe('unset()', () => {
    it('should remove a found redirect', () => {
      redirects.set(FROM, TO);
      redirects.set('/somewhere', '/somewhere_else');
      redirects.unset(FROM);
      expect(redirects.redirects.size).toEqual(1);
      expect(redirects.get('/somewhere')).toEqual('/somewhere_else');
    });
  });
});
