import { getAllowedQrCodeLink } from './getAllowedQrCodeLink';

const mockAppConfig = {};

jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  get qrCodeAllowedDomains() { return mockAppConfig.qrCodeAllowedDomains; },
}));

describe('engage > scanner > helpers > getAllowedQrCodeLink', () => {
  beforeEach(() => {
    mockAppConfig.qrCodeAllowedDomains = ['harborfreight.com', ' HF.tools '];
  });

  it('should return the link for a listed domain', () => {
    expect(getAllowedQrCodeLink('https://harborfreight.com/deals?x=1#top'))
      .toBe('https://harborfreight.com/deals?x=1#top');
  });

  it('should allow subdomains of a listed domain', () => {
    expect(getAllowedQrCodeLink('https://www.harborfreight.com/deals'))
      .toBe('https://www.harborfreight.com/deals');
    expect(getAllowedQrCodeLink('https://shop.hf.tools')).toBe('https://shop.hf.tools/');
  });

  it('should ignore the case of the host and the list entries', () => {
    expect(getAllowedQrCodeLink('https://WWW.HarborFreight.com/Deals'))
      .toBe('https://www.harborfreight.com/Deals');
    expect(getAllowedQrCodeLink('https://hf.tools/x')).toBe('https://hf.tools/x');
  });

  it('should return the normalized link which belongs to the checked host', () => {
    expect(getAllowedQrCodeLink('https://harborfreight.com\\@evil.com/'))
      .toBe('https://harborfreight.com/@evil.com/');
  });

  it('should accept an uppercase https scheme', () => {
    expect(getAllowedQrCodeLink('HTTPS://HARBORFREIGHT.COM/DEALS'))
      .toBe('https://harborfreight.com/DEALS');
  });

  it('should reject links which do not use https', () => {
    expect(getAllowedQrCodeLink('http://harborfreight.com/')).toBeNull();
    expect(getAllowedQrCodeLink('ftp://harborfreight.com/')).toBeNull();
  });

  it('should reject links with credentials', () => {
    expect(getAllowedQrCodeLink('https://user:pass@harborfreight.com/')).toBeNull();
    expect(getAllowedQrCodeLink('https://user@harborfreight.com/')).toBeNull();
  });

  it('should reject hosts which only look like a listed domain', () => {
    expect(getAllowedQrCodeLink('https://evilharborfreight.com')).toBeNull();
    expect(getAllowedQrCodeLink('https://harborfreight.com.evil.com')).toBeNull();
  });

  it('should reject links which contain a listed domain outside of the host', () => {
    expect(getAllowedQrCodeLink('https://evil.com/harborfreight.com')).toBeNull();
    expect(getAllowedQrCodeLink('https://evil.com/?x=harborfreight.com')).toBeNull();
    expect(getAllowedQrCodeLink('https://harborfreight.com@evil.com')).toBeNull();
  });

  it('should reject invalid links', () => {
    expect(getAllowedQrCodeLink('not a link')).toBeNull();
  });

  it('should reject all links when the list is empty or missing', () => {
    mockAppConfig.qrCodeAllowedDomains = [];
    expect(getAllowedQrCodeLink('https://harborfreight.com')).toBeNull();

    delete mockAppConfig.qrCodeAllowedDomains;
    expect(getAllowedQrCodeLink('https://harborfreight.com')).toBeNull();
  });

  it('should reject all links when the list is not an array', () => {
    mockAppConfig.qrCodeAllowedDomains = 'harborfreight.com';
    expect(getAllowedQrCodeLink('https://harborfreight.com')).toBeNull();
  });

  it('should accept entries with a scheme, a wildcard prefix or a path', () => {
    mockAppConfig.qrCodeAllowedDomains = ['https://harborfreight.com/', '*.hf.tools'];
    expect(getAllowedQrCodeLink('https://www.harborfreight.com'))
      .toBe('https://www.harborfreight.com/');
    expect(getAllowedQrCodeLink('https://hf.tools')).toBe('https://hf.tools/');
    expect(getAllowedQrCodeLink('https://shop.hf.tools')).toBe('https://shop.hf.tools/');
  });

  it('should accept entries with a port', () => {
    mockAppConfig.qrCodeAllowedDomains = ['harborfreight.com:443', 'https://hf.tools:8443/'];
    expect(getAllowedQrCodeLink('https://harborfreight.com')).toBe('https://harborfreight.com/');
    expect(getAllowedQrCodeLink('https://hf.tools')).toBe('https://hf.tools/');
  });

  it('should ignore entries without a dot', () => {
    mockAppConfig.qrCodeAllowedDomains = ['com', '*.com', 'https://localhost'];
    expect(getAllowedQrCodeLink('https://evil.com')).toBeNull();
    expect(getAllowedQrCodeLink('https://localhost')).toBeNull();
  });

  it('should ignore empty and invalid entries', () => {
    mockAppConfig.qrCodeAllowedDomains = ['', '  ', null, 42];
    expect(getAllowedQrCodeLink('https://harborfreight.com')).toBeNull();
  });
});
