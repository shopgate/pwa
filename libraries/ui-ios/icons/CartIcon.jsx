import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The cart icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const CartIcon = props => <Icon content={themeConfig.icons.cart} {...props} />;

export default CartIcon;
