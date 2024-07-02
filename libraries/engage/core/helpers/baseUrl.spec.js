import { getAppBaseUrl } from './baseUrl';

describe('baseUrl helpers', () => {
  describe('getAppBaseUrl()', () => {
    const deployedBase = 'https://sandbox.cdn.connect.shopgate.com/shop_30186/@shopgate/theme-ios11/6.22.3/11943/index.html';
    const deployedUrls = [
      `${deployedBase}`,
      `${deployedBase}/`,
      `${deployedBase}/page/page-id`,
      `${deployedBase}/category/123abc`,
      `${deployedBase}/cart`,
    ];

    const devBase = 'http://192.168.178.1:8080';
    const devUrls = [
      `${devBase}`,
      `${devBase}/`,
      `${devBase}/page/page-id`,
      `${devBase}/category/123abc`,
      `${devBase}/cart`,
    ];

    it.each(deployedUrls)('should get the expected based url from %s for deployed url schema', (url) => {
      expect(getAppBaseUrl(url)).toBe(deployedBase);
    });

    it.each(devUrls)('should get the expected based url from %s for development url schema', (url) => {
      expect(getAppBaseUrl(url)).toBe(devBase);
    });
  });
});
