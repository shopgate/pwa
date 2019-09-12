import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The view list icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const ViewList = props => <Icon content={themeConfig.icons.viewList} {...props} />;

export default ViewList;
