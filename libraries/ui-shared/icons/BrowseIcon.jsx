import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The home icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const Browse = props => <Icon content={themeConfig.icons.browse} {...props} />;

export default Browse;
