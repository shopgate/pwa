import redirects from './Redirects';

const FROM = '/from';
const TO = '/to';

describe('Redirects', () => {
  beforeEach(() => {
    redirects.constructor();
  });

  describe('.get()', () => {
    it('should get a valid redirect', () => {
      redirects.set(FROM, TO);
      expect(redirects.get(FROM)).toEqual(TO);
    });

    it('should get NULL for an unknown pathname', () => {
      expect(redirects.get(FROM)).toBeNull();
    });
  });

  describe('.getRedirect()', () => {
    it('should get a redirect for a distinct pathname', () => {
      redirects.set(FROM, TO);
      expect(redirects.getRedirect(FROM)).toBe(TO);
    });

    it('should get a redirect for a pathname which matches a registered pattern', () => {
      redirects.set(`${FROM}/:id`, TO);
      expect(redirects.getRedirect(`${FROM}/abc123`)).toBe(TO);
    });

    it('should get NULL for an unknown pathname', () => {
      expect(redirects.getRedirect(FROM)).toBeNull();
    });
  });

  describe('.getRedirectExtended()', () => {
    it('should get a redirect for a distinct pathname', () => {
      redirects.set(FROM, TO);
      expect(redirects.getRedirectExtended(FROM)).toEqual({
        matcher: FROM,
        handler: TO,
        pathParams: {},
        queryParams: {},
      });
    });

    it('should get a redirect for a pathname which matches a registered pattern', () => {
      const FROM_WITH_PARAM = `${FROM}/:id`;
      redirects.set(FROM_WITH_PARAM, TO);
      expect(redirects.getRedirectExtended(`${FROM}/abc123`)).toEqual({
        matcher: FROM_WITH_PARAM,
        handler: TO,
        pathParams: {
          id: 'abc123',
        },
        queryParams: {},
      });
    });

    it('should get a redirect for urls with path and query params', () => {
      const url = 'https://some.shop.de/product/some-product-name/abc123?some=param';
      const matcher = 'https://some.shop.de/product/:seoProductName/:productCode';

      redirects.set(matcher, TO);
      expect(redirects.getRedirectExtended(url)).toEqual({
        matcher,
        handler: TO,
        pathParams: {
          seoProductName: 'some-product-name',
          productCode: 'abc123',
        },
        queryParams: {
          some: 'param',
        },
      });
    });

    it('should get NULL for an unknown pathname', () => {
      expect(redirects.getRedirectExtended(FROM)).toBeNull();
    });
  });

  describe('.set()', () => {
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

  describe('.unset()', () => {
    it('should remove a found redirect', () => {
      redirects.set(FROM, TO);
      redirects.set('/somewhere', '/somewhere_else');
      redirects.unset(FROM);
      expect(redirects.redirects.size).toEqual(1);
      expect(redirects.get('/somewhere')).toEqual('/somewhere_else');
    });
  });
});
