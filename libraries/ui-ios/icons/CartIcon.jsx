import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The cart icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const CartIcon = props => <Icon content={themeConfig.icons.cart} viewBox="-10620 6658 20.447 24" {...props} />;

export default CartIcon;
