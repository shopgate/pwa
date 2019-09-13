import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * @link https://material.io/tools/icons/?icon=visibility&style=baseline
 *
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const VisibilityIcon = props => <Icon content={themeConfig.icons.visibility} {...props} />;

export default VisibilityIcon;
