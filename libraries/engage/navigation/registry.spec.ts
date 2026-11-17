import { logger } from '@shopgate/engage/core/helpers';
import {
  getExtensionActionMeta,
  getNavigationAction,
  getNavigationCatalog,
  isExtensionActionFor,
  registerNavigationAction,
} from './registry';
import { CORE_NAVIGATION_ACTIONS } from './actions';
import { DEFAULT_TAB_BAR_ITEMS } from './constants';
import type { NavigationActionHook, NavigationActionMeta } from './types';

jest.mock('./actions', () => ({
  CORE_NAVIGATION_ACTIONS: {
    cart: jest.fn(),
    favorites: jest.fn(),
  },
}));

jest.mock('@shopgate/engage/core/helpers/i18n', () => ({
  i18n: {
    text: (key: string) => `translated ${key}`,
    getLang: () => 'de-DE',
  },
}));

const extension: NavigationActionHook = () => ({
  available: true,
  icon: 'heart',
  label: 'extension',
  onClick: jest.fn(),
});

/**
 * Tab details as a class instance, which is no plain object.
 */
class TabDetails {
  label = 'Tab';

  icon = '';
}

const NON_PLAIN_TAB_DETAILS: Array<[string, unknown]> = [
  ['a string', 'Tab'],
  ['an array', [{ label: 'Tab' }]],
  ['a number', 1],
  ['a class instance', new TabDetails()],
  ['a map', new Map([['label', 'Tab'], ['icon', '']])],
];

describe('navigation action registry', () => {
  let warn: jest.SpyInstance;

  beforeEach(() => {
    warn = jest.spyOn(logger, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    warn.mockRestore();
  });

  it('uses the core action while no extension replaces it', () => {
    expect(getNavigationAction('cart')).toBe(CORE_NAVIGATION_ACTIONS.cart);
  });

  it('lets an extension replace the core action', () => {
    registerNavigationAction('favorites', extension);

    expect(getNavigationAction('favorites')).toBe(extension);
  });

  it('knows no action without an implementation', () => {
    expect(getNavigationAction('share')).toBeUndefined();
  });

  it('keeps the details an action was registered with', () => {
    const meta = {
      tabBar: {
        label: 'card.label',
        icon: 'card',
      },
    };
    registerNavigationAction('@shopgate/customer-card/card', extension, meta);

    expect(getNavigationAction('@shopgate/customer-card/card')).toBe(extension);
    expect(getExtensionActionMeta('@shopgate/customer-card/card', 'tabBar')).toBe(meta.tabBar);
  });

  it('knows no details of an action registered without any', () => {
    registerNavigationAction('@shopgate/header-only/button', extension);

    expect(getExtensionActionMeta('@shopgate/header-only/button', 'tabBar')).toBeUndefined();
  });

  it('replaces the details when an action is registered again', () => {
    registerNavigationAction('@shopgate/again/tab', extension, {
      tabBar: {
        label: 'first',
        icon: '',
      },
    });
    registerNavigationAction('@shopgate/again/tab', extension);

    expect(getExtensionActionMeta('@shopgate/again/tab', 'tabBar')).toBeUndefined();
  });

  describe('registration warnings', () => {
    it('warns about tab details without a string label or icon', () => {
      registerNavigationAction('@shopgate/warn/untyped', extension, {
        tabBar: {} as unknown as NavigationActionMeta['tabBar'],
      });

      expect(warn).toHaveBeenCalledTimes(2);
      expect(warn).toHaveBeenCalledWith('registerNavigationAction: "@shopgate/warn/untyped" has no string tabBar.label, so its tab and its admin item show a fallback text');
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('"@shopgate/warn/untyped" has no string tabBar.icon'));
    });

    it('does not warn about valid tab details or an action without them', () => {
      registerNavigationAction('@shopgate/warn/valid', extension, {
        tabBar: {
          label: 'Valid',
          icon: '',
        },
      });
      registerNavigationAction('@shopgate/warn/header-only', extension);
      registerNavigationAction('@shopgate/warn/null', extension, {
        tabBar: null as unknown as NavigationActionMeta['tabBar'],
      });

      expect(warn).not.toHaveBeenCalled();
    });

    it('does not warn about an empty label', () => {
      registerNavigationAction('@shopgate/warn/empty', extension, {
        tabBar: {
          label: '',
          icon: '',
        },
      });

      expect(warn).not.toHaveBeenCalled();
    });

    it.each(NON_PLAIN_TAB_DETAILS)('warns once about tab details that are %s', (_, tabBar) => {
      registerNavigationAction('@shopgate/warn/no-object', extension, {
        tabBar: tabBar as unknown as NavigationActionMeta['tabBar'],
      });

      expect(warn).toHaveBeenCalledTimes(1);
      expect(warn).toHaveBeenCalledWith('registerNavigationAction: "@shopgate/warn/no-object" has a tabBar that is no plain object, so it is no tab bar item');
    });
  });

  describe('isExtensionActionFor', () => {
    it('accepts an extension action registered with tab details', () => {
      registerNavigationAction('@shopgate/tab/item', extension, {
        tabBar: {
          label: 'Tab',
          icon: '',
        },
      });

      expect(isExtensionActionFor('@shopgate/tab/item', 'tabBar')).toBe(true);
    });

    it('rejects an extension action without tab details', () => {
      registerNavigationAction('@shopgate/button/item', extension, {});

      expect(isExtensionActionFor('@shopgate/button/item', 'tabBar')).toBe(false);
      expect(isExtensionActionFor('@shopgate/header-only/button', 'tabBar')).toBe(false);
    });

    it.each([
      ['null', null],
      ...NON_PLAIN_TAB_DETAILS,
    ])('rejects an extension action whose tab details are %s', (_, tabBar) => {
      registerNavigationAction('@shopgate/tab/invalid', extension, {
        tabBar: tabBar as unknown as NavigationActionMeta['tabBar'],
      });

      expect(isExtensionActionFor('@shopgate/tab/invalid', 'tabBar')).toBe(false);
    });

    it('rejects unknown actions', () => {
      expect(isExtensionActionFor('unknown', 'tabBar')).toBe(false);
    });

    it('rejects a core action, even when an extension replaces it with tab details', () => {
      registerNavigationAction('favorites', extension, {
        tabBar: {
          label: 'favorites.label',
          icon: 'heart',
        },
      });

      expect(isExtensionActionFor('favorites', 'tabBar')).toBe(false);
    });
  });

  describe('getExtensionActionMeta', () => {
    it('returns the tab details of an extension action', () => {
      const tabBar = {
        label: 'Meta',
        icon: 'meta',
      };
      registerNavigationAction('@shopgate/meta/tab', extension, { tabBar });

      expect(getExtensionActionMeta('@shopgate/meta/tab', 'tabBar')).toBe(tabBar);
    });

    it('returns nothing for an action without tab details, an unknown or a core action', () => {
      registerNavigationAction('cart', extension, {
        tabBar: {
          label: 'cart.label',
          icon: 'cart',
        },
      });

      expect(getExtensionActionMeta('@shopgate/header-only/button', 'tabBar')).toBeUndefined();
      expect(getExtensionActionMeta('unknown', 'tabBar')).toBeUndefined();
      expect(getExtensionActionMeta('cart', 'tabBar')).toBeUndefined();
    });

    it('returns tab details without a string label', () => {
      const tabBar = { icon: 'meta' } as unknown as NavigationActionMeta['tabBar'];
      registerNavigationAction('@shopgate/meta/no-label', extension, { tabBar });

      expect(getExtensionActionMeta('@shopgate/meta/no-label', 'tabBar')).toBe(tabBar);
      expect(isExtensionActionFor('@shopgate/meta/no-label', 'tabBar')).toBe(true);
    });
  });

  describe('getNavigationCatalog', () => {
    /**
     * Registers a tab with the given details and reads its catalog item.
     * @param action The name of the action.
     * @param tabBar The fields of the tab details besides the icon, which may have any type.
     * @returns The catalog item of the action.
     */
    const getItem = (action: string, tabBar: Record<string, unknown>) => {
      registerNavigationAction(action, extension, {
        tabBar: {
          icon: 'card',
          ...tabBar,
        } as unknown as NavigationActionMeta['tabBar'],
      });

      return getNavigationCatalog().tabBar.extensionItems.find(item => item.action === action);
    };

    it('reports copies of the default tab bar items', () => {
      const { tabBar } = getNavigationCatalog();

      expect(tabBar.defaultItems).toEqual(DEFAULT_TAB_BAR_ITEMS);
      expect(tabBar.defaultItems).not.toBe(DEFAULT_TAB_BAR_ITEMS);
      expect(tabBar.defaultItems[0]).not.toBe(DEFAULT_TAB_BAR_ITEMS[0]);
    });

    it('lists the registered extension actions with tab details', () => {
      registerNavigationAction('@shopgate/rewards/tab', extension, {
        tabBar: {
          label: 'rewards.label',
          icon: '@shopgate/rewards/icon',
        },
      });
      registerNavigationAction('@shopgate/plain/tab', extension, {
        tabBar: {
          label: 'Plain',
          icon: '',
        },
      });
      registerNavigationAction('@shopgate/no-tab/button', extension, {});

      const { extensionItems } = getNavigationCatalog().tabBar;

      expect(extensionItems).toEqual(expect.arrayContaining([
        {
          action: '@shopgate/rewards/tab',
          label: 'translated rewards.label',
          icon: '@shopgate/rewards/icon',
        },
        {
          action: '@shopgate/plain/tab',
          label: 'translated Plain',
          icon: '',
        },
      ]));
      expect(extensionItems).not.toContainEqual(expect.objectContaining({
        action: '@shopgate/no-tab/button',
      }));
      expect(extensionItems).not.toContainEqual(expect.objectContaining({
        action: '@shopgate/header-only/button',
      }));
    });

    it('never lists a core action, even when an extension replaces it', () => {
      registerNavigationAction('cart', extension, {
        tabBar: {
          label: 'cart.label',
          icon: 'cart',
        },
      });

      expect(getNavigationCatalog().tabBar.extensionItems)
        .not.toContainEqual(expect.objectContaining({ action: 'cart' }));
    });

    it('reports an empty icon when the tab details have no string icon', () => {
      registerNavigationAction('@shopgate/no-icon/tab', extension, {
        tabBar: { label: 'No icon' } as unknown as NavigationActionMeta['tabBar'],
      });

      expect(getNavigationCatalog().tabBar.extensionItems).toContainEqual({
        action: '@shopgate/no-icon/tab',
        label: 'translated No icon',
        icon: '',
      });
    });

    describe('label fallback', () => {
      it('lists an action with an empty label under the admin label of the shop language', () => {
        const adminLabel = {
          'en-us': 'Customer card',
          'de-de': 'Kundenkarte',
        };

        expect(getItem('@shopgate/fallback/tab', {
          label: '',
          adminLabel,
        })).toEqual({
          action: '@shopgate/fallback/tab',
          label: 'Kundenkarte',
          icon: 'card',
          adminLabel,
        });
      });

      it('lists an action with an empty label under the en-us admin label without one of the shop language', () => {
        expect(getItem('@shopgate/fallback/tab', {
          label: '',
          adminLabel: {
            'en-us': 'Customer card',
            'fr-fr': 'Carte client',
          },
        })?.label).toBe('Customer card');
      });

      it('lists an action with a null label under its name without admin labels', () => {
        expect(getItem('@shopgate/fallback/tab', { label: null })).toEqual({
          action: '@shopgate/fallback/tab',
          label: '@shopgate/fallback/tab',
          icon: 'card',
        });
      });
    });

    describe('adminLabel', () => {
      it('passes the admin labels on without translating them', () => {
        const adminLabel = {
          'en-us': 'Customer card',
          'de-de': 'Kundenkarte',
        };

        const item = getItem('@shopgate/admin-label/valid', {
          label: 'card.label',
          adminLabel,
        });

        expect(item).toEqual({
          action: '@shopgate/admin-label/valid',
          label: 'translated card.label',
          icon: 'card',
          adminLabel: {
            'en-us': 'Customer card',
            'de-de': 'Kundenkarte',
          },
        });
      });

      it('reports a new object that later changes of the extension do not reach', () => {
        const adminLabel: Record<string, string> = { 'en-us': 'Customer card' };

        const item = getItem('@shopgate/admin-label/copy', {
          label: 'card.label',
          adminLabel,
        });
        adminLabel['en-us'] = 'Changed';

        expect(item?.adminLabel).not.toBe(adminLabel);
        expect(item?.adminLabel).toEqual({ 'en-us': 'Customer card' });
      });

      it('leaves out the admin labels when the action has none', () => {
        registerNavigationAction('@shopgate/admin-label/none', extension, {
          tabBar: {
            label: 'card.label',
            icon: 'card',
          },
        });

        const item = getNavigationCatalog().tabBar.extensionItems
          .find(({ action }) => action === '@shopgate/admin-label/none');

        expect(item).toBeDefined();
        expect(item).not.toHaveProperty('adminLabel');
      });

      it.each([
        ['a string', 'Customer card'],
        ['null', null],
        ['an array', ['Customer card']],
        ['a map without string values', {
          'en-us': 1,
          'de-de': null,
          'fr-fr': { text: 'Carte client' },
        }],
        ['an empty map', {}],
        ['an object with another prototype', Object.assign(Object.create({ 'it-it': 'Inherited' }), {
          'en-us': 'Customer card',
        })],
      ])('leaves out the admin labels when they are %s', (_, adminLabel) => {
        const item = getItem('@shopgate/admin-label/invalid', {
          label: 'card.label',
          adminLabel,
        });

        expect(item).toBeDefined();
        expect(item).not.toHaveProperty('adminLabel');
      });

      it('passes on admin labels without a prototype', () => {
        const adminLabel = Object.assign(Object.create(null), { 'en-us': 'Customer card' });

        const item = getItem('@shopgate/admin-label/null-prototype', {
          label: 'card.label',
          adminLabel,
        });

        expect(item?.adminLabel).toEqual({ 'en-us': 'Customer card' });
      });

      it('keeps only the entries with a string key and a string value', () => {
        const adminLabel = {
          'en-us': 'Customer card',
          'de-de': 42,
          'fr-fr': undefined,
          'es-es': ['Tarjeta'],
          [Symbol('nl-nl')]: 'Klantenkaart',
        };

        const item = getItem('@shopgate/admin-label/mixed', {
          label: 'card.label',
          adminLabel,
        });

        expect(item?.adminLabel).toEqual({ 'en-us': 'Customer card' });
      });
    });
  });
});
