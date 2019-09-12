import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The check icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const Check = props => <Icon content={themeConfig.icons.check} {...props} />;

export default Check;
