import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The placeholder icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const Placeholder = props => <Icon content={themeConfig.icons.placeholder} {...props} />;

export default Placeholder;
