import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The filter icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const Filter = props => <Icon content={themeConfig.icons.filter} {...props} />;

export default Filter;
