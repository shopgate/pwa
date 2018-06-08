import ParsedLink from './index';

const mockedWarnLog = jest.fn();
jest.mock('@shopgate/pwa-core/helpers', () => ({
  logger: {
    warn: (...args) => mockedWarnLog(...args),
  },
}));

jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  shopAlias: 'example-alias',
}));

const mockedEventTrigger = jest.fn();
jest.mock('@shopgate/pwa-core/classes/Event', () => ({
  trigger: (...args) => mockedEventTrigger(...args),
}));

const mockedExternalLink = jest.fn();
jest.mock('./actions', () => ({
  externalLink: (...args) => mockedExternalLink(...args),
}));

describe('ParsedLink', () => {
  afterEach(() => {
    mockedWarnLog.mockClear();
    mockedEventTrigger.mockClear();
    mockedExternalLink.mockClear();
  });
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
  });
});
