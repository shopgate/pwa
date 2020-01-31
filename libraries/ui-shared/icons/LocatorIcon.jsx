import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The FlashOn icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const Locator = props => <Icon content={themeConfig.icons.locator} {...props} />;

export default Locator;
