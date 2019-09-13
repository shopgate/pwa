import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The heart icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const Grid = props => <Icon content={themeConfig.icons.grid} {...props} />;

export default Grid;
