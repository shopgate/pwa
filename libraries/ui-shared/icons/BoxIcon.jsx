import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The box icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const Box = props => <Icon content={themeConfig.icons.box} {...props} />;

export default Box;
