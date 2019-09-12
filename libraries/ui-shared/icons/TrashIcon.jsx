import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The trash icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const Trash = props => <Icon content={themeConfig.icons.trash} {...props} />;

export default Trash;
