import { useEffect } from 'react';
import { isDev, logger } from '@shopgate/engage/core/helpers';
import SvgIcon, { type SvgIconProps } from '../SvgIcon';
import { useThemeIcon } from '../../hooks/useThemeIcon';
import type { IconName } from '../../types';

export interface ThemeIconProps extends Omit<SvgIconProps, 'markup' | 'keepColors' | 'normalize' | 'scale' | 'strokeWidth'> {
  /**
   * The name of the icon, a core icon or one an extension registered.
   */
  name: IconName;
}

const warnedNames = new Set<string>();

/**
 * Warns once per name in development that no icon has that name.
 * @param name The icon name.
 */
const warnUnknownIcon = (name: string) => {
  if (!isDev || warnedNames.has(name)) {
    return;
  }

  warnedNames.add(name);
  logger.warn(`ThemeIcon: no icon is named "${name}". Extensions register their icons in an appWillStart$ subscriber.`);
};

/**
 * Renders an icon by its name. Merchants can replace it via the app settings.
 * @returns The icon, or null when no icon has that name.
 */
const ThemeIcon = ({ name, ...props }: ThemeIconProps) => {
  const icon = useThemeIcon(name);

  useEffect(() => {
    if (!icon) {
      warnUnknownIcon(name);
    }
  }, [icon, name]);

  if (!icon) {
    return null;
  }

  return (
    <SvgIcon
      {...props}
      markup={icon.svg}
      keepColors={icon.keepColors}
      normalize={icon.normalize}
      scale={icon.scale}
      strokeWidth={icon.strokeWidth}
    />
  );
};

export default ThemeIcon;
