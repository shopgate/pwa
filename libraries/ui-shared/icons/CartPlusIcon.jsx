import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The cart plus icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const CartPlus = props => <Icon content={themeConfig.icons.cartPlus} {...props} />;

export default CartPlus;
