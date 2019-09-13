import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The cart icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const More = props => <Icon viewBox="-10528.875 6667.75 26.502 6.5" content={themeConfig.icons.more} {...props} />;

export default More;
