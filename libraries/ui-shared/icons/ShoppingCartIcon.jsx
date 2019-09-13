import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The shopping cart icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const ShoppingCart = props => <Icon content={themeConfig.icons.shoppingCart} {...props} />;

export default ShoppingCart;
