import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * @link https://material.io/tools/icons/?icon=lock&style=baseline
 *
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const LockIcon = props => <Icon content={themeConfig.icons.lock} {...props} />;

export default LockIcon;
