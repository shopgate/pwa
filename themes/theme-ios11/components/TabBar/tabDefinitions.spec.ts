import { getTabDefinition } from './tabDefinitions';

describe('getTabDefinition()', () => {
  it.each([
    ['home', 'home', 'tab_bar.home'],
    ['browse', 'browse', 'tab_bar.browse'],
    ['categoryDrawer', 'browse', 'tab_bar.browse'],
    ['cart', 'cart', 'tab_bar.cart'],
    ['favorites', 'favorites', 'tab_bar.favorites'],
    ['more', 'more', 'tab_bar.more'],
  ])('describes the %s tab', (action, type, label) => {
    expect(getTabDefinition(action)).toEqual({
      type,
      label,
    });
  });

  it.each(['none', 'openSearch', '@shopgate/test/card', 'constructor', '__proto__'])('has no tab for %j', (action) => {
    expect(getTabDefinition(action)).toBeUndefined();
  });
});
