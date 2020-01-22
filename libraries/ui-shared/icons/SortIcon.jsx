import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The sort icon component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const Sort = props => <Icon content={themeConfig.icons.sort} {...props} />;

export default Sort;
