import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The star-outline icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const StarOutline = props => <Icon content={themeConfig.icons.starOutline} {...props} />;

export default StarOutline;
