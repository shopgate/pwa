import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The filter icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const MoreVert = props => <Icon content={themeConfig.icons.moreVert} {...props} />;

export default MoreVert;
