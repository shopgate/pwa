import Icon from '@shopgate/pwa-common/components/Icon';
import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

export interface ArrowIconProps extends Omit<IconProps, 'content'> {
  shadow?: boolean;
}

/**
 * The arrow icon component.
 */
const ArrowIcon = ({ shadow = false, ...props }: ArrowIconProps) => {
  const content = shadow ? themeConfig.icons.arrowShadowed : themeConfig.icons.arrow;
  return <Icon content={content} {...props} />;
};

export default ArrowIcon;
