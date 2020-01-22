import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The unchecked icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const Unchecked = props => <Icon content={themeConfig.icons.unchecked} {...props} />;

export default Unchecked;
