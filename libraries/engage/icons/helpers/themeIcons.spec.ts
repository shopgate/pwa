import { createThemeIcons, getLegacyThemeIcons, setThemeIconResolver } from './themeIcons';

describe('engage > icons > helpers > themeIcons', () => {
  const legacy = {
    cart: '<path d="cart"/>',
    empty: null,
  };

  afterEach(() => {
    setThemeIconResolver(null);
  });

  it('keeps the keys of the theme extension config', () => {
    expect(Object.keys(createThemeIcons(legacy))).toEqual(['cart', 'empty']);
  });

  it('returns the delivered icons while no resolver is set', () => {
    const icons = createThemeIcons(legacy);

    expect(icons.cart).toBe('<path d="cart"/>');
    expect(icons.empty).toBeNull();
  });

  it('reads the icons through the resolver once one is set', () => {
    const icons = createThemeIcons(legacy);

    setThemeIconResolver(name => (name === 'cart' ? '<svg viewBox="0 0 48 48"/>' : null));

    expect(icons.cart).toBe('<svg viewBox="0 0 48 48"/>');
    expect(icons.empty).toBeNull();
  });

  it('keeps the delivered icons for the resolver', () => {
    createThemeIcons(legacy);
    setThemeIconResolver(() => '<svg/>');

    expect(getLegacyThemeIcons()).toEqual(legacy);
  });

  it('ignores writes of the resolved icons', () => {
    const icons = createThemeIcons(legacy);
    setThemeIconResolver(name => (name === 'cart' ? '<svg/>' : null));

    const resolved = icons.cart;
    icons.cart = resolved;

    expect(getLegacyThemeIcons().cart).toBe('<path d="cart"/>');
  });

  it('takes over writes of changed icons', () => {
    const icons = createThemeIcons(legacy);

    icons.empty = '<path d="new"/>';

    expect(icons.empty).toBe('<path d="new"/>');
    expect(getLegacyThemeIcons().empty).toBe('<path d="new"/>');
  });

  it('survives a deep merge of the read values', () => {
    const icons = createThemeIcons(legacy);
    setThemeIconResolver(() => '<svg/>');

    expect(() => Object.assign(icons, { ...icons })).not.toThrow();
    expect(getLegacyThemeIcons()).toEqual(legacy);
  });
});
