import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The tick icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const Tick = props => <Icon content={themeConfig.icons.tick} {...props} />;

export default Tick;
