import queryString from 'query-string';
import { LEGACY_URL } from '../../constants/Registration';
import { CHECKOUT_PATH, INDEX_PATH } from '../../constants/RoutePaths';
import buildRegisterUrl from './buildRegisterUrl';

describe('buildRegisterUrl', () => {
  it('should create the expected url when no redirect was passed', () => {
    const result = queryString.parseUrl(buildRegisterUrl(LEGACY_URL));

    expect(result.url).toBe(LEGACY_URL);
    expect(result.query).toEqual({
      sgcloud_callback_data: `{"redirectTo":"${INDEX_PATH}"}`,
    });
  });

  it('should create the expected url when no redirect was passed and the source url includes GET parameters', () => {
    const result = queryString.parseUrl(buildRegisterUrl(`${LEGACY_URL}?foo=bar`));

    expect(result.url).toBe(LEGACY_URL);
    expect(result.query).toEqual({
      foo: 'bar',
      sgcloud_callback_data: `{"redirectTo":"${INDEX_PATH}"}`,
    });
  });

  it('should create the expected url when a common redirect url with GET parameters was passed', () => {
    const result = queryString.parseUrl(buildRegisterUrl(LEGACY_URL, '/some_url?foo=bar'));

    expect(result.url).toBe(LEGACY_URL);
    expect(result.query).toEqual({
      sgcloud_callback_data: '{"redirectTo":"/some_url?foo=bar"}',
    });
  });

  it('should create the expected url when a checkout redirect url was passed', () => {
    const result = queryString.parseUrl(buildRegisterUrl(`${LEGACY_URL}?foo=bar`, CHECKOUT_PATH));

    expect(result.url).toBe(LEGACY_URL);
    expect(result.query).toEqual({
      foo: 'bar',
      sgcloud_callback_data: `{"redirectTo":"${INDEX_PATH}"}`,
      sgcloud_checkout: '1',
    });
  });
});

