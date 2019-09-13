import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The list icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const List = props => <Icon content={themeConfig.icons.list} {...props} />;

export default List;
