import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The chevron icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const Chevron = props => <Icon content={themeConfig.icons.chevron} {...props} />;

export default Chevron;
