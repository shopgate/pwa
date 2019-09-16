import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * @link https://material.io/tools/icons/?icon=visibility_off&style=baseline
 *
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const VisibilityOffIcon = props => <Icon content={themeConfig.icons.visibilityOff} {...props} />;

export default VisibilityOffIcon;
