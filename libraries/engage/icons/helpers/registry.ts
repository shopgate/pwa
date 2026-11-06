import { isDev, logger } from '@shopgate/engage/core/helpers';
import { coreIcons } from '../defaults/coreIcons';
import type { IconDefinition, RegisteredIcon } from '../types';

const registeredIcons = new Map<string, RegisteredIcon>();

const SUPPORTED_PROPERTIES = ['svg'];

const EXTENSION_ICON_NAME = /^@[^/\s]+\/[^/\s]+\/[^/\s]+$/;

/**
 * Warns in development about properties of a registered icon that are ignored.
 * @param name The icon name.
 * @param icon The icon as passed to `registerIcons`.
 */
const warnIgnoredProperties = (name: string, icon: RegisteredIcon) => {
  const ignored = Object.keys(icon).filter(key => !SUPPORTED_PROPERTIES.includes(key));

  if (isDev && ignored.length) {
    logger.warn(`registerIcons: "${name}" ignores ${ignored.join(', ')}; only ${SUPPORTED_PROPERTIES.join(', ')} is supported`);
  }
};

/**
 * Checks whether a name belongs to an icon the app ships with.
 * @param name The icon name.
 * @returns Whether it is a core icon.
 */
export const isCoreIcon = (name: string) => Object.prototype.hasOwnProperty.call(coreIcons, name);

/**
 * Registers icons of an extension, so merchants can replace them like the icons of the app.
 * Names have to be namespaced with the extension's scope, e.g. `@shopgate/ext-foo/truck`.
 * Register them in an `appWillStart$` subscriber: icons registered after the first render only
 * show once their component renders again.
 * @param icons The icons by name, as complete svg elements or as `{ svg }`.
 */
export const registerIcons = (icons: Record<string, string | RegisteredIcon>) => {
  Object.entries(icons).forEach(([name, icon]) => {
    const definition: RegisteredIcon = typeof icon === 'string' ? { svg: icon } : icon;

    if (isCoreIcon(name) || !EXTENSION_ICON_NAME.test(name)) {
      logger.warn(`registerIcons: "${name}" is no extension icon name of the form @scope/extension/name and was skipped`);
      return;
    }

    if (typeof definition?.svg !== 'string' || !definition.svg.trim()) {
      logger.warn(`registerIcons: "${name}" has no svg markup and was skipped`);
      return;
    }

    warnIgnoredProperties(name, definition);
    registeredIcons.set(name, { svg: definition.svg });
  });
};

/**
 * Returns the default of an icon: the core icon, or the icon an extension registered.
 * @param name The icon name.
 * @returns The icon definition, or null when no icon has that name.
 */
export const getIconDefinition = (name: string): IconDefinition | null => {
  if (isCoreIcon(name)) {
    return coreIcons[name as keyof typeof coreIcons];
  }

  return registeredIcons.get(name) ?? null;
};

/**
 * Returns the names of all icons that can be replaced.
 * @returns The core icon names followed by the registered ones.
 */
export const getIconNames = () => Object.keys(coreIcons).concat(Array.from(registeredIcons.keys()));

/**
 * Returns where an icon comes from.
 * @param name The icon name.
 * @returns `core`, or the scope of the extension that registered the icon.
 */
export const getIconOrigin = (name: string) => (
  isCoreIcon(name) ? 'core' : name.slice(0, name.lastIndexOf('/'))
);
