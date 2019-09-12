import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The home icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const Browse = props => <Icon content={themeConfig.icons.browse} {...props} viewBox="-10720 6659.999 31.002 21.998" />;

export default Browse;
