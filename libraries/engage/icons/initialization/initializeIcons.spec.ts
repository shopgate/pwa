import { getIconOverrides } from '../helpers/overrides';
import { createThemeIcons, setThemeIconResolver } from '../helpers/themeIcons';
import { initializeIcons } from './initializeIcons';

/**
 * Creates a minimal store with app settings.
 * @param icons The icon overrides of the app settings.
 * @returns The store and a function that replaces the overrides.
 */
const createStore = (icons: Record<string, unknown>) => {
  let state = { settings: { appSettings: { icons } } };
  const listeners: Array<() => void> = [];

  return {
    store: {
      getState: () => state,
      subscribe: (listener: () => void) => {
        listeners.push(listener);
      },
    },
    setIcons: (nextIcons: Record<string, unknown>) => {
      state = { settings: { appSettings: { icons: nextIcons } } };
      listeners.forEach(listener => listener());
    },
  };
};

describe('engage > icons > initialization > initializeIcons', () => {
  afterEach(() => {
    setThemeIconResolver(null);
  });

  it('hands the overrides to the icons and follows store changes', () => {
    const first = { cart: { svg: '<svg/>' } };
    const second = { burger: { svg: '<svg/>' } };
    const { store, setIcons } = createStore(first);

    initializeIcons(store);

    expect(getIconOverrides()).toBe(first);

    setIcons(second);

    expect(getIconOverrides()).toBe(second);
  });

  it('lets the theme config icons resolve through the overrides', () => {
    const themeIcons = createThemeIcons({ cart: '<path d="legacy"/>' });
    const { store } = createStore({ cart: { svg: '<svg viewBox="0 0 48 48"/>' } });

    initializeIcons(store);

    expect(themeIcons.cart).toBe('<svg viewBox="0 0 48 48"/>');
  });
});
