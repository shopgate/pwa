import SvgIcon, { type SvgIconProps } from '../SvgIcon';
import { useThemeIcon } from '../../hooks/useThemeIcon';
import type { IconName } from '../../types';

export interface ThemeIconProps extends Omit<SvgIconProps, 'markup' | 'keepColors' | 'normalize'> {
  /**
   * The name of the icon, a core icon or one an extension registered.
   */
  name: IconName;
}

/**
 * Renders an icon by its name. Merchants can replace it via the app settings.
 * @returns The icon, or null when no icon has that name.
 */
const ThemeIcon = ({ name, ...props }: ThemeIconProps) => {
  const icon = useThemeIcon(name);

  if (!icon) {
    return null;
  }

  return (
    <SvgIcon
      {...props}
      markup={icon.svg}
      keepColors={icon.keepColors}
      normalize={icon.normalize}
    />
  );
};

export default ThemeIcon;
