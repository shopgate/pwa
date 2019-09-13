import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The cross icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const Cross = props => <Icon content={themeConfig.icons.cross} {...props} />;

export default Cross;
