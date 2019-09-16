import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The magnifier icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const Magnifier = props => <Icon content={themeConfig.icons.magnifier} {...props} />;

export default Magnifier;
