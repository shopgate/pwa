import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The burger icon component.
 */
const Burger = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.burger} {...props} />);

export default Burger;
