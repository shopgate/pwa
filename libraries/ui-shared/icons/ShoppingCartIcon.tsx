import React from 'react';
import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The shopping cart icon component.
 */
const ShoppingCart = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.shoppingCart} {...props} />);

export default ShoppingCart;
