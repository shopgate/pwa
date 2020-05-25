import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The stop icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const WarningIcon = props => <Icon content={themeConfig.icons.warning} {...props} />;

export default WarningIcon;
