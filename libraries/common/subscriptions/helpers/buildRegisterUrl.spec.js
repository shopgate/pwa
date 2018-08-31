import queryString from 'query-string';
import { LEGACY_URL } from '../../constants/Registration';
import { CHECKOUT_PATH, INDEX_PATH } from '../../constants/RoutePaths';
import buildRegisterUrl from './buildRegisterUrl';

describe('buildRegisterUrl', () => {
  it('should create the expected url when no redirect was passed', () => {
    const url = LEGACY_URL;

    const result = queryString.parseUrl(buildRegisterUrl(url));

    expect(result.url).toBe(LEGACY_URL);
    expect(result.query).toEqual({
      sgcloud_callback_data: `{"redirectTo":"${INDEX_PATH}"}`,
    });
  });

  it('should create the expected url when no redirect was passed and the source url includes GET parameters', () => {
    const url = `${LEGACY_URL}?foo=bar`;

    const result = queryString.parseUrl(buildRegisterUrl(url));

    expect(result.url).toBe(LEGACY_URL);
    expect(result.query).toEqual({
      foo: 'bar',
      sgcloud_callback_data: `{"redirectTo":"${INDEX_PATH}"}`,
    });
  });

  it('should create the expected url when a common redirect url with GET parameters was passed', () => {
    const url = LEGACY_URL;
    const redirect = '/some_url?foo=bar';

    const result = queryString.parseUrl(buildRegisterUrl(url, redirect));

    expect(result.url).toBe(LEGACY_URL);
    expect(result.query).toEqual({
      sgcloud_callback_data: `{"redirectTo":"${redirect}"}`,
    });
  });

  it('should create the expected url when a checkout redirect url was passed', () => {
    const url = `${LEGACY_URL}?foo=bar`;
    const redirect = CHECKOUT_PATH;

    const result = queryString.parseUrl(buildRegisterUrl(url, redirect));

    expect(result.url).toBe(LEGACY_URL);
    expect(result.query).toEqual({
      foo: 'bar',
      sgcloud_callback_data: `{"redirectTo":"${INDEX_PATH}"}`,
      sgcloud_checkout: '1',
    });
  });
});

