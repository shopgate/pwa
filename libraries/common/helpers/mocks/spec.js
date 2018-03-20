import mockRenderOptions from './mockRenderOptions';

describe('MockRenderOptions', () => {
  it('should return object', () => {
    expect(typeof mockRenderOptions).toBe('object');
    expect(typeof mockRenderOptions.context.i18n).toBe('function');
    const i18n = mockRenderOptions.context.i18n();
    /* eslint-disable no-underscore-dangle */
    expect(i18n.__('foo')).toBe('foo');
    expect(i18n.__()).toBe('');
    expect(i18n._p()).toBe('p');
    expect(i18n._d()).toBe('d');
    /* eslint-enable no-underscore-dangle */
  });
});
