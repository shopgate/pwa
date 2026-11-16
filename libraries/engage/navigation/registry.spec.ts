import {
  getNavigationAction,
  getNavigationActionMeta,
  getNavigationCatalog,
  isTabBarExtensionAction,
  registerNavigationAction,
} from './registry';
import { CORE_NAVIGATION_ACTIONS } from './actions';
import { DEFAULT_TAB_BAR_ITEMS } from './constants';
import type { NavigationActionHook } from './types';

jest.mock('./actions', () => ({
  CORE_NAVIGATION_ACTIONS: {
    cart: jest.fn(),
    favorites: jest.fn(),
  },
}));

jest.mock('@shopgate/engage/core/helpers/i18n', () => ({
  i18n: { text: (key: string) => `translated ${key}` },
}));

const extension: NavigationActionHook = () => ({
  available: true,
  icon: 'heart',
  label: 'extension',
  onClick: jest.fn(),
});

describe('navigation action registry', () => {
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
    expect(getNavigationActionMeta('@shopgate/customer-card/card')).toBe(meta);
  });

  it('knows no details of an action registered without any', () => {
    registerNavigationAction('@shopgate/header-only/button', extension);

    expect(getNavigationActionMeta('@shopgate/header-only/button')).toBeUndefined();
    expect(getNavigationActionMeta('cart')).toBeUndefined();
    expect(getNavigationActionMeta('unknown')).toBeUndefined();
  });

  it('replaces the details when an action is registered again', () => {
    registerNavigationAction('@shopgate/again/tab', extension, {
      tabBar: {
        label: 'first',
        icon: '',
      },
    });
    registerNavigationAction('@shopgate/again/tab', extension);

    expect(getNavigationActionMeta('@shopgate/again/tab')).toBeUndefined();
  });

  describe('isTabBarExtensionAction', () => {
    it('accepts an extension action registered with tab details', () => {
      registerNavigationAction('@shopgate/tab/item', extension, {
        tabBar: {
          label: 'Tab',
          icon: '',
        },
      });

      expect(isTabBarExtensionAction('@shopgate/tab/item')).toBe(true);
    });

    it('rejects an extension action without tab details', () => {
      registerNavigationAction('@shopgate/button/item', extension, {});

      expect(isTabBarExtensionAction('@shopgate/button/item')).toBe(false);
      expect(isTabBarExtensionAction('@shopgate/header-only/button')).toBe(false);
    });

    it('rejects unknown actions', () => {
      expect(isTabBarExtensionAction('unknown')).toBe(false);
    });

    it('rejects a core action, even when an extension replaces it with tab details', () => {
      registerNavigationAction('favorites', extension, {
        tabBar: {
          label: 'favorites.label',
          icon: 'heart',
        },
      });

      expect(isTabBarExtensionAction('favorites')).toBe(false);
    });
  });

  describe('getNavigationCatalog', () => {
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

    describe('adminLabel', () => {
      /**
       * Registers a tab with admin labels and reads its catalog item.
       * @param action The name of the action.
       * @param adminLabel The admin labels of the tab.
       * @returns The catalog item of the action.
       */
      const getItem = (action: string, adminLabel: unknown) => {
        registerNavigationAction(action, extension, {
          tabBar: {
            label: 'card.label',
            icon: 'card',
            adminLabel: adminLabel as Record<string, string>,
          },
        });

        return getNavigationCatalog().tabBar.extensionItems.find(item => item.action === action);
      };

      it('passes the admin labels on without translating them', () => {
        const adminLabel = {
          'en-us': 'Customer card',
          'de-de': 'Kundenkarte',
        };

        const item = getItem('@shopgate/admin-label/valid', adminLabel);

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

        const item = getItem('@shopgate/admin-label/copy', adminLabel);
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
      ])('leaves out the admin labels when they are %s', (_, adminLabel) => {
        const item = getItem('@shopgate/admin-label/invalid', adminLabel);

        expect(item).toBeDefined();
        expect(item).not.toHaveProperty('adminLabel');
      });

      it('keeps only the own entries with string values', () => {
        const adminLabel = Object.assign(Object.create({ 'it-it': 'Inherited' }), {
          'en-us': 'Customer card',
          'de-de': 42,
          'fr-fr': undefined,
          'es-es': ['Tarjeta'],
          [Symbol('nl-nl')]: 'Klantenkaart',
        });

        const item = getItem('@shopgate/admin-label/mixed', adminLabel);

        expect(item?.adminLabel).toEqual({ 'en-us': 'Customer card' });
      });
    });
  });
});
