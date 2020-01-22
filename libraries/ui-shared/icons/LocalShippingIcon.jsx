import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The local shipping icon component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const LocalShipping = props => <Icon content={themeConfig.icons.localShipping} {...props} />;

export default LocalShipping;
