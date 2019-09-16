import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The security icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const Security = props => <Icon content={themeConfig.icons.security} {...props} />;

export default Security;
