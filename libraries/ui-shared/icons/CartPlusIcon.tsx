import React from 'react';
import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The cart plus icon component.
 */
const CartPlus = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.cartPlus} {...props} />);

export default CartPlus;
