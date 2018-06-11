import ParsedLink from './index';

const mockedWarnLog = jest.fn();
jest.mock('@shopgate/pwa-core/helpers', () => ({
  logger: {
    warn: (...args) => mockedWarnLog(...args),
  },
}));

jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  shopCNAME: 'm.example.com',
}));

const mockedEventTrigger = jest.fn();
jest.mock('@shopgate/pwa-core/classes/Event', () => ({
  trigger: (...args) => mockedEventTrigger(...args),
}));

const mockedExternalLink = jest.fn();
const mockedReactRouter = jest.fn();
jest.mock('./actions', () => ({
  externalLink: (...args) => mockedExternalLink(...args),
  reactRouter: (...args) => mockedReactRouter(...args),
}));

describe('ParsedLink', () => {
  afterEach(() => {
    mockedWarnLog.mockClear();
    mockedEventTrigger.mockClear();
    mockedExternalLink.mockClear();
    mockedReactRouter.mockClear();
  });
  describe('.isShopgateShopLink', () => {
    const positives = [
      'http://foo.shopgate.com',
      'https://foo.shopgate.com',
      'http://foo.shopgate.com/page/cms',
      'https://foo.shopgate.com/page/cms',
      'https://m.example.com',
      'http://m.example.com',
      'http://m.example.com/page/cms',
      'https://m.example.com/page/cms',
    ];
    const negatives = [
      'https://example.com/bar',
      'https://example.com',
      'http://shopgate.com/foo',
      'https://shopgate.com/foo',
      'https://www.shopgate.com',
      'http://www.shopgate.com',
      'http://example.com',
      'https://example.com',
      'https://example.com/page/cms',
    ];

    positives.forEach((href) => {
      it(`should return true for ${href} link`, () => {
        expect(ParsedLink.isShopgateShopLink(href)).toBe(true);
      });
    });
    negatives.forEach((href) => {
      it(`should return false for ${href} link`, () => {
        expect(ParsedLink.isShopgateShopLink(href)).toBe(false);
      });
    });
  });
  describe('Main', () => {
    it('should parse a simple link', () => {
      const href = 'https://example.com/foo?bar=1';
      const link = new ParsedLink(href);
      expect(link.getHref()).toBe(href);
      expect(link.getOriginalHref()).toBe(href);
      expect(link.actions).toEqual([
        {
          action: 'externalLink',
          options: 'https://example.com/foo?bar=1',
        },
      ]);
    });
    it('should warn when invalid action is added', () => {
      const link = new ParsedLink('/foo');
      link.addLinkAction('foo');
      expect(mockedWarnLog).toHaveBeenCalled();
    });
    it('should call all handlers with appropriate action on open', () => {
      const link = new ParsedLink('https://example.com/foo');
      link.open(undefined, true);
      expect(mockedExternalLink).toHaveBeenCalled();
      expect(mockedWarnLog).not.toHaveBeenCalled();
    });
    it('should recognize internal shopgate link as internal', () => {
      const link = new ParsedLink('https://foo.shopgate.com/page/cms');
      link.open();
      expect(mockedExternalLink).not.toHaveBeenCalled();
      expect(mockedWarnLog).not.toHaveBeenCalled();
      expect(mockedReactRouter).toHaveBeenCalled();
      expect(mockedReactRouter.mock.calls[0][0]).toEqual({ queryParams: {}, url: '/page/cms' });
    });
  });
});
