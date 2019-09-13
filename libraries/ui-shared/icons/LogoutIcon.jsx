import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The logout icon component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const Logout = props => <Icon content={themeConfig.icons.logout} {...props} />;

export default Logout;
