import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The Share icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const ShareIcon = props => <Icon content={themeConfig.icons.share} {...props} />;

export default ShareIcon;
