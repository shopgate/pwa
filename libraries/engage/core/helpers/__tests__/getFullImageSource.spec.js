import {
  getThemeSettings,
} from '@shopgate/engage/core';
import { getImageFormat } from '../getImageFormat';
import { getFullImageSource } from '../getFullImageSource';

jest.mock('@shopgate/engage/core/config/getThemeSettings', () => ({
  getThemeSettings: jest.fn(() => ({})),
}));

jest.mock('../getImageFormat', () => ({
  getImageFormat: jest.fn(() => 'jpeg'),
}));

describe('getFullImageSource()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the original URL when it is not a shopgate image', () => {
    const url = 'https://example.com?foo=bar&company=acme';
    const result = getFullImageSource(url);
    expect(result).toBe(url);
  });

  describe('images.shopgate.services', () => {
    const baseUrl = 'https://images.shopgate.services/v2/images/scale/https%3A%2F%2Ffusion-m2.magento.shopgatedev.com%2Fmedia%2Fcatalog%2Fproduct%2Fcache%2F3e4f53d6cf7dc6044c90d14611016db4%2Fm%2Fb%2Fmb02-gray-0.jpg%3Fsome%3Dget%26parameter%3Dvalues%2642%3D1337?Expires=1711666800&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9pbWFnZXMuc2hvcGdhdGUuc2VydmljZXMvdjIvaW1hZ2VzL3NjYWxlL2h0dHBzJTNBJTJGJTJGZnVzaW9uLW0yLm1hZ2VudG8uc2hvcGdhdGVkZXYuY29tJTJGbWVkaWElMkZjYXRhbG9nJTJGcHJvZHVjdCUyRmNhY2hlJTJGM2U0ZjUzZDZjZjdkYzYwNDRjOTBkMTQ2MTEwMTZkYjQlMkZtJTJGYiUyRm1iMDItZ3JheS0wLmpwZyUzRnNvbWUlM0RnZXQlMjZwYXJhbWV0ZXIlM0R2YWx1ZXMlMjY0MiUzRDEzMzcKiIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTcxMTY2NjgwMH19fV19&Signature=SIK67ITpB3yrtU4VnpnkrTcc20I0QNHzLqEnm2nXF1z9yWCPKlZKlhlqHnvez-KLwG6xIR9lbQSbDNPFMH7ORMbPC8gNk310Ox0A6-fujKshIgGP5JbmCitvCbsUwsBd8vTA95ZatrSqmu55pJ5Dmhy--VefrriOleYk2koSLHGEHf3WvSRLexqd82Lpx8DEHv77AfEptsxsSL3AQoIEXvzx5qo-MP30YTeWDsoxdduX4HIsN2aWGvLfimR3AjrPGY2g0ninSA88E9OePr1RdYuNrn0nj3HSXeYsob2r92DSPhxi4LkAgO6TSgZT9PlVJPiz-8bAgv-VPb-2pfQ__&Key-Pair-Id=APKAINMNDAWPE3XM2H7Q&version=1';

    it('should add query parameters as expected when the input url does not already contain similar parameters', () => {
      const result = getFullImageSource(baseUrl, {
        width: 1024,
        height: 1024,
      });

      expect(result).toBe(`${baseUrl}&format=jpeg&width=1024&height=1024&quality=75&fill=FFFFFF,1`);
    });

    it('should add query parameters as expected when the input url already contains similar parameters', () => {
      const result = getFullImageSource(`${baseUrl}&width=512&format=png&height=512`, {
        width: 1024,
        height: 1024,
      });

      expect(result).toBe(`${baseUrl}&format=jpeg&width=1024&height=1024&quality=75&fill=FFFFFF,1`);
    });

    it('should create the url independent from the order of input parameters', () => {
      expect(getFullImageSource(baseUrl, {
        width: 400,
        height: 400,
      })).toBe(getFullImageSource(baseUrl, {
        height: 400,
        width: 400,
      }));
    });

    it('should use PNG format when getImageFormat() returns png', () => {
      getImageFormat.mockReturnValueOnce('png');

      const result = getFullImageSource(baseUrl, {
        width: 1024,
        height: 1024,
      });

      expect(result).toBe(`${baseUrl}&format=png&width=1024&height=1024&quality=75&fill=FFFFFF,1`);
    });

    it('should use parameters from the theme settings', () => {
      getThemeSettings.mockReturnValueOnce({
        quality: 10,
        fillColor: 'AAA,0',
      });
      const result = getFullImageSource(baseUrl, {
        width: 1024,
        height: 1024,
      });

      expect(result).toBe(`${baseUrl}&format=jpeg&width=1024&height=1024&quality=10&fill=AAA,0`);
    });
  });

  describe('https://img-cdn.shopgate.com', () => {
    const baseUrl = 'https://img-cdn.shopgate.com/some/parameter';

    it('should not add query parameters when the url already contains parameters', () => {
      const url = `${baseUrl}?foo=bar`;
      const result = getFullImageSource(url, {
        height: 1024,
        width: 1024,
      });

      expect(result).toBe(url);
    });

    it('should add query parameters as expected', () => {
      const result = getFullImageSource(baseUrl, {
        height: 1024,
        width: 1024,
      });

      expect(result).toBe(`${baseUrl}?w=1024&h=1024&q=70&zd=resize&fillc=FFFFFF`);
    });

    it('should add query parameters independent from the order of input parameters', () => {
      const result = getFullImageSource(baseUrl, {
        width: 1024,
        height: 1024,
      });

      expect(result).toBe(`${baseUrl}?w=1024&h=1024&q=70&zd=resize&fillc=FFFFFF`);
    });
  });
});
