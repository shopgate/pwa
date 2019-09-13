import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The heart icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const Heart = props => <Icon content={themeConfig.icons.heart} {...props} />;

export default Heart;
