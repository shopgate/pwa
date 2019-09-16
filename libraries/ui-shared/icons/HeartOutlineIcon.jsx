import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The heart-outline icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const HeartOutline = props => <Icon content={themeConfig.icons.heartOutline} {...props} />;

export default HeartOutline;
