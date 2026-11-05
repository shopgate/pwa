import type { ComponentType } from 'react';
import { themeConfig } from '@shopgate/engage';
import {
  BarcodeScannerIcon,
  BrowseIcon,
  BurgerIcon,
  CartIcon,
  HeartIcon,
  HomeIcon,
  Icon,
  InfoIcon,
  LocationIcon,
  LocatorIcon,
  MagnifierIcon,
  MoreIcon,
  MoreVertIcon,
  NotificationIcon,
  PersonIcon,
  ShareIconIOS,
  StarIcon,
} from '@shopgate/engage/components';

/**
 * The icons a header button can show, by the names the Theme Config offers. Each icon component
 * already takes the icon of the shop's theme config and falls back to its own markup.
 */
// The icon components are untyped JavaScript or take props of their own, none of them required.
const ICONS = {
  magnifier: MagnifierIcon,
  barcodeScanner: BarcodeScannerIcon,
  share: ShareIconIOS,
  burger: BurgerIcon,
  browse: BrowseIcon,
  pin: LocationIcon,
  store: LocatorIcon,
  cart: CartIcon,
  heart: HeartIcon,
  person: PersonIcon,
  home: HomeIcon,
  notification: NotificationIcon,
  star: StarIcon,
  info: InfoIcon,
  more: MoreIcon,
  moreVert: MoreVertIcon,
} as unknown as Record<string, ComponentType>;

const themeIcons = new Map<string, ComponentType>();

/**
 * Resolves the icon component of a header button.
 * @param name The name of the icon.
 * @returns The icon component, an icon of the shop's theme config for other names, or null.
 */
export const getActionIcon = (name: string): ComponentType | null => {
  if (!name) {
    return null;
  }

  if (Object.prototype.hasOwnProperty.call(ICONS, name)) {
    return ICONS[name];
  }

  const icons = (themeConfig as { icons?: Record<string, unknown> } | undefined)?.icons;
  const markup = icons && Object.prototype.hasOwnProperty.call(icons, name) ? icons[name] : null;

  if (typeof markup !== 'string' || !markup) {
    return null;
  }

  if (!themeIcons.has(name)) {
    /**
     * Renders the icon of the shop's theme config.
     * @returns The icon.
     */
    const ThemeIcon = () => <Icon content={markup} />;
    themeIcons.set(name, ThemeIcon);
  }

  return themeIcons.get(name) ?? null;
};
