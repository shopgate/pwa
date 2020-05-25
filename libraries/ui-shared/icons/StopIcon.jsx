import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The stop icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const StopIcon = props => <Icon content={themeConfig.icons.stop} {...props} />;

export default StopIcon;
