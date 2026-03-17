import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The cart icon component.
 */
const CartIcon = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.cart} {...props} />);

export default CartIcon;
