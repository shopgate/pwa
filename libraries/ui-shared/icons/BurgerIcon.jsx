import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The burger icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const Burger = props => <Icon content={themeConfig.icons.burger} {...props} />;

export default Burger;
